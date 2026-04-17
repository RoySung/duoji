import Dexie, { type EntityTable } from 'dexie'
import { Category } from '@/entities/category'
import { Transaction } from '@/entities/transaction'
import { RegisteredUser } from '@/entities/user'
import { AccountBook } from '@/entities/accountBook'
import { SettlementRecord } from '@/entities/settlement'
import { accountBookList, userList } from '@/mocks'

// TODO: remove mocks data
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
  }
}
export const db = new DuojiDB()

// 資料庫初始化函數
export async function initializeDB(): Promise<void> {
  try {
    await db.open()
    console.log('Database initialized successfully')

    // 初始化預設資料
    await initializeMockData()
  } catch (error) {
    console.error('Failed to initialize database:', error)
  }
}

/**
 * 初始化 Mock 資料
 */
async function initializeMockData(): Promise<void> {
  try {
    // 初始化用戶資料
    const userCount = await db.users.count()
    if (userCount === 0) {
      await db.users.bulkPut(userList)
      console.log('Mock user data initialized')
    }

    const accountBookCount = await db.accountBooks.count()
    if (accountBookCount === 0) {
      await db.accountBooks.bulkPut(accountBookList)
      console.log('Mock account book data initialized')
    }
  } catch (error) {
    console.error('Failed to initialize mock data:', error)
  }
}
