import {
  Transaction,
  TransactionRepo,
  TransactionSchema,
} from '@/entities/transaction'
import { db } from '@/lib/dexie'

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
      // Filter out soft-deleted transactions
      return all.filter((transaction) => transaction.deletedAt === null)
    } catch (error) {
      console.error('Failed to find all transactions:', error)
      return []
    }
  }

  async findByAccountBookId(accountBookId: string): Promise<Transaction[]> {
    try {
      const transactions = await db.transactions
        .where('accountBookId')
        .equals(accountBookId)
        .toArray()
      // Filter out soft-deleted transactions
      return transactions.filter((transaction) => transaction.deletedAt === null)
    } catch (error) {
      console.error('Failed to find transactions by accountBookId:', error)
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
