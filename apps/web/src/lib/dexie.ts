import Dexie, { type EntityTable } from 'dexie'
import { Category } from '@/entities/category'
import { Transaction } from '@/entities/transaction'
import { RegisteredUser } from '@/entities/user'
import { AccountBook } from '@/entities/accountBook'
import { SettlementRecord } from '@/entities/settlement'
import { Settings } from '@/entities/settings'

/**
 * Duoji App 本地資料庫
 * 使用 Dexie 管理 IndexedDB
 */
class DuojiDB extends Dexie {
  categories!: EntityTable<Category, 'id'>
  transactions!: EntityTable<Transaction, 'id'>
  users!: EntityTable<RegisteredUser, 'id'>
  accountBooks!: EntityTable<AccountBook, 'id'>
  settlements!: EntityTable<SettlementRecord, 'id'>
  appSettings!: EntityTable<Settings, 'id'>

  constructor() {
    super('DuojiDB')

    this.version(1).stores({
      categories: '&id, name, type, parentId, accountBookId, sortOrder',
      transactions:
        '&id, accountBookId, date, type, categoryId, settlementRecordId, [accountBookId+deletedAt], [accountBookId+date]',
      users: '&id, name, email',
      accountBooks: '&id, name, ownerId, *userIds',
      settlements: '&id, accountBookId, createdAt',
    })

    this.version(2).stores({
      appSettings: '&id',
    })
  }
}
export const db = new DuojiDB()

export async function resetAllData(): Promise<void> {
  try {
    db.close()
    await Dexie.delete('DuojiDB')
  } finally {
    if (typeof window !== 'undefined') {
      window.localStorage.clear()
    }
  }
}

// 資料庫初始化函數
export async function initializeDB(): Promise<void> {
  try {
    await db.open()
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Failed to initialize database:', error)
  }
}
