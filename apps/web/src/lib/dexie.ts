import Dexie, { type EntityTable } from 'dexie'
import { Category, Transaction } from '@/entities/transaction'
import { User } from '@/entities/user'
import { AccountBook } from '@/entities/accountBook'
import { accountBookList, categoryList, userList } from '@/mocks'

/**
 * Duoji App 本地資料庫
 * 使用 Dexie 管理 IndexedDB
 */
class DuojiDB extends Dexie {
  categories!: EntityTable<Category, 'id'>
  transactions!: EntityTable<Transaction, 'id'>
  users!: EntityTable<User, 'id'>
  accountBooks!: EntityTable<AccountBook, 'id'>

  constructor() {
    super('DuojiDB')

    this.version(1).stores({
      categories: '&id, name, type, parentId',
      users: '&id, name, email',
      accountBooks: '&id, name, ownerId, *userIds',
    })

    this.version(2).stores({
      categories: '&id, name, type, parentId',
      transactions: '&id, accountBookId, date, type, categoryId',
      users: '&id, name, email',
      accountBooks: '&id, name, ownerId, *userIds',
    })
  }
}

// 建立全域資料庫實例
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
    // 初始化分類資料
    const categoryCount = await db.categories.count()
    if (categoryCount === 0) {
      await addCategories(categoryList)
      console.log('Mock category data initialized')
    }

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

/**
 * 批量新增分類到資料庫
 */
async function addCategories(categories: Category[]): Promise<void> {
  for (const category of categories) {
    await db.categories.put(category)
  }
}
