import { AccountBookRepo, AccountBook } from '@/entities/accountBook'
import { db } from '@/lib/dexie'

/**
 * 帳本本地儲存實作
 * 使用 Dexie (IndexedDB) 儲存帳本資料
 */
class AccountBookLocalRepo implements AccountBookRepo {
  async create(accountBook: AccountBook): Promise<AccountBook> {
    try {
      // 檢查 ID 是否已存在
      const existing = await db.accountBooks
        .where('id')
        .equals(accountBook.id)
        .first()
      if (existing) {
        throw new Error(`AccountBook with id ${accountBook.id} already exists`)
      }
      console.log('Creating accountBook:', accountBook)
      await db.accountBooks.put(accountBook)
      return accountBook
    } catch (error) {
      console.error('Failed to create accountBook:', error)
      throw error
    }
  }

  async findById(id: string): Promise<AccountBook | null> {
    try {
      const accountBook = await db.accountBooks.where('id').equals(id).first()
      return accountBook || null
    } catch (error) {
      console.error('Failed to find accountBook by id:', error)
      return null
    }
  }

  async findAll(): Promise<AccountBook[]> {
    try {
      return await db.accountBooks.toArray()
    } catch (error) {
      console.error('Failed to find all accountBooks:', error)
      return []
    }
  }

  async findByOwnerId(ownerId: string): Promise<AccountBook[]> {
    try {
      return await db.accountBooks.where('ownerId').equals(ownerId).toArray()
    } catch (error) {
      console.error('Failed to find accountBooks by ownerId:', error)
      return []
    }
  }

  async findByMemberId(memberId: string): Promise<AccountBook[]> {
    try {
      return await db.accountBooks.where('memberIds').equals(memberId).toArray()
    } catch (error) {
      console.error('Failed to find accountBooks by memberId:', error)
      return []
    }
  }

  async update(
    id: string,
    updates: Partial<AccountBook>
  ): Promise<AccountBook | null> {
    try {
      const accountBook = await db.accountBooks.where('id').equals(id).first()
      if (!accountBook) {
        return null
      }

      const updatedAccountBook = { ...accountBook, ...updates }
      await db.accountBooks.put(updatedAccountBook)
      return updatedAccountBook
    } catch (error) {
      console.error('Failed to update accountBook:', error)
      return null
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const count = await db.accountBooks.where('id').equals(id).delete()
      return count > 0
    } catch (error) {
      console.error('Failed to delete accountBook:', error)
      return false
    }
  }

  async clear(): Promise<void> {
    try {
      await db.accountBooks.clear()
    } catch (error) {
      console.error('Failed to clear account books:', error)
      throw error
    }
  }
}

export default AccountBookLocalRepo
