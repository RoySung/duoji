import {
  SettlementRecord,
  SettlementRecordSchema,
  SettlementRepo,
} from '@/entities/settlement'
import { TransactionSchema } from '@/entities/transaction'
import { db } from '@/lib/dexie'

class SettlementLocalRepo implements SettlementRepo {
  async create(
    record: SettlementRecord,
    transactionIds: string[] = []
  ): Promise<SettlementRecord> {
    const validated = SettlementRecordSchema.parse(record)
    const existing = await db.settlements.get(validated.id)

    if (existing) {
      throw new Error(
        `Settlement record with id ${validated.id} already exists`
      )
    }

    await db.settlements.add(validated)

    if (transactionIds.length > 0) {
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
    }

    return validated
  }

  async findById(id: string): Promise<SettlementRecord | null> {
    const record = await db.settlements.get(id)

    if (!record) {
      return null
    }

    return record
  }

  async findByAccountBookId(
    accountBookId: string
  ): Promise<SettlementRecord[]> {
    const records = await db.settlements
      .where('accountBookId')
      .equals(accountBookId)
      .toArray()

    return records
  }

  async update(
    id: string,
    updates: Partial<SettlementRecord>
  ): Promise<SettlementRecord | null> {
    const existing = await db.settlements.get(id)

    if (!existing) {
      return null
    }

    const updated = SettlementRecordSchema.parse({
      ...existing,
      ...updates,
      id: existing.id,
      createdAt: existing.createdAt,
    })

    await db.settlements.put(updated)
    return updated
  }
}

export default SettlementLocalRepo
