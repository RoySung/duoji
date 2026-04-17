import {
  Transaction,
  TransactionDateQuery,
  TransactionDateRangeQuery,
  TransactionRepo,
  TransactionSchema,
  UNSETTLED_SETTLEMENT_RECORD_ID,
} from '@/entities/transaction'
import { db } from '@/lib/dexie'

function excludeSoftDeleted(transactions: Transaction[]): Transaction[] {
  return transactions.filter((transaction) => transaction.deletedAt === null)
}

class TransactionLocalRepo implements TransactionRepo {
  async create(transaction: Transaction): Promise<Transaction> {
    try {
      const validatedTransaction = TransactionSchema.parse(transaction)
      const existing = await db.transactions.get(validatedTransaction.id)

      if (existing) {
        throw new Error(
          `Transaction with id ${validatedTransaction.id} already exists`
        )
      }

      await db.transactions.add(validatedTransaction)
      return validatedTransaction
    } catch (error) {
      console.error('Failed to create transaction:', error)
      throw error
    }
  }

  async findById(id: string): Promise<Transaction | null> {
    try {
      const transaction = await db.transactions.get(id)

      if (!transaction) {
        return null
      }

      // Filter out soft-deleted transactions
      if (transaction.deletedAt !== null) {
        return null
      }

      return transaction
    } catch (error) {
      console.error('Failed to find transaction by id:', error)
      return null
    }
  }

  async findAll(): Promise<Transaction[]> {
    try {
      const all = await db.transactions.toArray()
      return excludeSoftDeleted(all)
    } catch (error) {
      console.error('Failed to find all transactions:', error)
      return []
    }
  }

  async findByDate({
    date,
    accountBookId,
  }: TransactionDateQuery): Promise<Transaction[]> {
    try {
      const transactions = accountBookId
        ? await db.transactions
            .where('[accountBookId+date]')
            .equals([accountBookId, date])
            .toArray()
        : await db.transactions.where('date').equals(date).toArray()

      return excludeSoftDeleted(transactions)
    } catch (error) {
      console.error('Failed to find transactions by date query:', error)
      return []
    }
  }

  async findByAccountBookId(accountBookId: string): Promise<Transaction[]> {
    try {
      const transactions = await db.transactions
        .where('accountBookId')
        .equals(accountBookId)
        .toArray()
      return excludeSoftDeleted(transactions)
    } catch (error) {
      console.error('Failed to find transactions by accountBookId:', error)
      return []
    }
  }

  async findByDateRange(
    query: TransactionDateRangeQuery
  ): Promise<Transaction[]> {
    const { startDate, endDate, accountBookId } = query

    try {
      const transactions = accountBookId
        ? await db.transactions
            .where('[accountBookId+date]')
            .between(
              [accountBookId, startDate],
              [accountBookId, endDate],
              true,
              true
            )
            .toArray()
        : await db.transactions
            .where('date')
            .between(startDate, endDate, true, true)
            .toArray()

      return excludeSoftDeleted(transactions)
    } catch (error) {
      console.error('Failed to find transactions by date range:', error)
      return []
    }
  }

  async findUnsettledExpenseByAccountBookId(
    accountBookId: string
  ): Promise<Transaction[]> {
    try {
      return await db.transactions
        .where('settlementRecordId')
        .equals(UNSETTLED_SETTLEMENT_RECORD_ID)
        .filter(
          (transaction) =>
            transaction.accountBookId === accountBookId &&
            transaction.deletedAt === null &&
            transaction.type === 'expense'
        )
        .toArray()
    } catch (error) {
      console.error(
        'Failed to find unsettled expense transactions by accountBookId:',
        error
      )
      return []
    }
  }

  // Future entry points for additional retrieval scenarios:
  // - findByAccountBookIdAndCategoryId(accountBookId, categoryId)
  // Each scenario should be composed into a dedicated hook rather than shared global state.

  async findBySettlementRecordId(recordId: string): Promise<Transaction[]> {
    try {
      const transactions = await db.transactions
        .where('settlementRecordId')
        .equals(recordId)
        .toArray()

      return excludeSoftDeleted(transactions)
    } catch (error) {
      console.error('Failed to find transactions by settlementRecordId:', error)
      return []
    }
  }

  async update(
    id: string,
    updates: Partial<Transaction>
  ): Promise<Transaction | null> {
    try {
      const existing = await db.transactions.get(id)
      if (!existing) {
        return null
      }

      const updatedTransaction = TransactionSchema.parse({
        ...existing,
        ...updates,
        id: existing.id,
        createdAt: existing.createdAt,
      })

      await db.transactions.put(updatedTransaction)
      return updatedTransaction
    } catch (error) {
      console.error('Failed to update transaction:', error)
      throw error
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      // Soft delete: mark transaction with current timestamp instead of removing it
      const existing = await db.transactions.get(id)
      if (!existing) {
        return false
      }

      // Mark as deleted by setting deletedAt timestamp
      const deleted = await this.update(id, { deletedAt: Date.now() })
      return deleted !== null
    } catch (error) {
      console.error('Failed to delete transaction:', error)
      return false
    }
  }

  async clear(): Promise<void> {
    try {
      await db.transactions.clear()
    } catch (error) {
      console.error('Failed to clear transactions:', error)
      throw error
    }
  }
}

export default TransactionLocalRepo
