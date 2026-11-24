import {
  SettlementRecord,
  SettlementRecordSchema,
  SettlementRepo,
} from '@/entities/settlement'
import {
  TransactionSchema,
  UNSETTLED_SETTLEMENT_RECORD_ID,
} from '@/entities/transaction'
import { db } from '@/lib/dexie'

class SettlementLocalRepo implements SettlementRepo {
  async create(
    record: SettlementRecord,
    transactionIds: string[] = []
  ): Promise<SettlementRecord> {
    const validated = SettlementRecordSchema.parse(record)
    return db.transaction('rw', db.settlements, db.transactions, async () => {
      const existing = await db.settlements.get(validated.id)

      if (existing) {
        throw new Error(
          `Settlement record with id ${validated.id} already exists`
        )
      }

      await db.settlements.add(validated)
      if (transactionIds.length === 0) return validated

      const transactions = await db.transactions.bulkGet(transactionIds)
      const updatedTransactions = transactions
        .filter((transaction): transaction is NonNullable<typeof transaction> =>
          Boolean(transaction)
        )
        .map((transaction) =>
          TransactionSchema.parse({
            ...transaction,
            settlementRecordId: validated.id,
          })
        )

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
