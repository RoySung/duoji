import {
  SettlementCreateTransactions,
  SettlementRecord,
  SettlementRecordSchema,
  SettlementRepo,
  StaleSettlementReviewError,
} from '@/entities/settlement'
import {
  Transaction,
  TransactionSchema,
  UNSETTLED_SETTLEMENT_RECORD_ID,
} from '@/entities/transaction'
import { db } from '@/lib/dexie'
import { resolveAccountBookUsers, UserLocalRepo } from '@/repositories/userRepo'
import {
  getSettlementReviewMembers,
  haveSameSettlementExpenses,
  haveSameSettlementReviewMembers,
  isUnsettledExpense,
} from '@/utils/settlementUtils'

class SettlementLocalRepo implements SettlementRepo {
  async findReviewUsers(accountBookId: string) {
    const accountBook = await db.accountBooks.get(accountBookId)
    return accountBook
      ? resolveAccountBookUsers(accountBook, new UserLocalRepo())
      : null
  }

  async create(
    record: SettlementRecord,
    transactionIdsOrReview: SettlementCreateTransactions = []
  ): Promise<SettlementRecord> {
    const validated = SettlementRecordSchema.parse(record)
    const tables = Array.isArray(transactionIdsOrReview)
      ? [db.settlements, db.transactions]
      : [db.settlements, db.transactions, db.accountBooks, db.users]
    return db.transaction('rw', tables, async () => {
      const existing = await db.settlements.get(validated.id)

      if (existing) {
        throw new Error(
          `Settlement record with id ${validated.id} already exists`
        )
      }

      let transactions: Transaction[]
      if (Array.isArray(transactionIdsOrReview)) {
        const linked = await db.transactions.bulkGet(transactionIdsOrReview)
        transactions = linked.filter((transaction) => transaction !== undefined)
      } else {
        const [eligibleExpenses, users] = await Promise.all([
          db.transactions
            .where('accountBookId')
            .equals(validated.accountBookId)
            .filter(isUnsettledExpense)
            .toArray(),
          this.findReviewUsers(validated.accountBookId),
        ])
        transactions = eligibleExpenses

        if (
          !users ||
          transactions.length === 0 ||
          !haveSameSettlementReviewMembers(
            transactionIdsOrReview.reviewedMembers,
            getSettlementReviewMembers(users)
          ) ||
          !haveSameSettlementExpenses(
            transactionIdsOrReview.reviewedExpenses,
            transactions
          )
        ) {
          throw new StaleSettlementReviewError()
        }
      }

      const updatedTransactions = transactions.map((transaction) =>
        TransactionSchema.parse({
          ...transaction,
          settlementRecordId: validated.id,
        })
      )

      await db.settlements.add(validated)
      if (updatedTransactions.length > 0) {
        await db.transactions.bulkPut(updatedTransactions)
      }

      return validated
    })
  }

  async findById(id: string): Promise<SettlementRecord | null> {
    const record = await db.settlements.get(id)

    return record && record.deletedAt == null ? record : null
  }

  async findByAccountBookId(
    accountBookId: string
  ): Promise<SettlementRecord[]> {
    const records = await db.settlements
      .where('accountBookId')
      .equals(accountBookId)
      .filter((record) => record.deletedAt == null)
      .toArray()

    return records
  }

  async cancel(accountBookId: string, id: string): Promise<void> {
    await db.transaction('rw', db.settlements, db.transactions, async () => {
      const record = await this.findById(id)
      if (!record || record.accountBookId !== accountBookId) {
        throw new Error('Settlement record is unavailable in this account book')
      }

      if (
        record.transfers.some((transfer) => transfer.status === 'completed')
      ) {
        throw new Error('Settlement record has a completed transfer')
      }

      const now = Date.now()
      await db.settlements.update(id, { deletedAt: now, updatedAt: now })
      await db.transactions
        .where('settlementRecordId')
        .equals(id)
        .filter((transaction) => transaction.accountBookId === accountBookId)
        .modify({ settlementRecordId: UNSETTLED_SETTLEMENT_RECORD_ID })
    })
  }

  async update(
    id: string,
    updates: Partial<SettlementRecord>
  ): Promise<SettlementRecord | null> {
    return db.transaction('rw', db.settlements, async () => {
      const existing = await this.findById(id)
      if (!existing) {
        return null
      }

      const updated = SettlementRecordSchema.parse({
        ...existing,
        ...updates,
        id: existing.id,
        createdAt: existing.createdAt,
        deletedAt: existing.deletedAt,
      })

      await db.settlements.put(updated)
      return updated
    })
  }
}

export default SettlementLocalRepo
