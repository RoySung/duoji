import { useState, useEffect } from 'react'
import { Button } from '@heroui/react'
import Layout from '@/components/layout/layout'
import { CategoryLocalRepo } from '@/repositories/categoryRepo'
import { AccountBookLocalRepo } from '@/repositories/accountBookRepo'
import { Category } from '@/entities/transaction'
import { AccountBook } from '@/entities/accountBook'
import { expenseCategoryList, incomeCategoryList } from '@/mocks/category'

const categoryRepo = new CategoryLocalRepo()
const accountBookRepo = new AccountBookLocalRepo()

export default function TestDbPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [accountBooks, setAccountBooks] = useState<AccountBook[]>([])
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs((prev) => [
      `${new Date().toLocaleTimeString()}: ${message}`,
      ...prev,
    ])
  }

  // 載入資料
  const loadData = async () => {
    try {
      addLog('Loading categories and account books...')
      const [categories, books] = await Promise.all([
        categoryRepo.findAll(),
        accountBookRepo.findAll(),
      ])
      setCategories(categories)
      setAccountBooks(books)
      addLog(
        `Loaded ${categories.length} categories and ${books.length} account books`
      )
    } catch (error) {
      addLog(`Error loading data: ${error}`)
    }
  }

  // 清空並填入測試資料
  const seedMockData = async () => {
    try {
      addLog('Seeding mock data...')

      // 清空現有資料
      await categoryRepo.clear()
      await accountBookRepo.clear()

      // 插入分類資料
      const allCategories = [...expenseCategoryList, ...incomeCategoryList]
      for (const category of allCategories) {
        await categoryRepo.create(category)
      }

      // 插入帳本資料
      const mockAccountBooks: AccountBook[] = [
        {
          id: 'book-1',
          name: '個人帳本',
          description: '個人日常消費記錄',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          currency: 'TWD',
          ownerId: 'user-1',
          userIds: [],
        },
        {
          id: 'book-2',
          name: '家庭共用帳本',
          description: '家庭支出分帳',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          currency: 'TWD',
          ownerId: 'user-1',
          userIds: [],
        },
      ]

      for (const book of mockAccountBooks) {
        await accountBookRepo.create(book)
      }

      addLog(
        `Seeded ${allCategories.length} categories and ${mockAccountBooks.length} account books`
      )
      await loadData()
    } catch (error) {
      addLog(`Error seeding data: ${error}`)
    }
  }

  // 測試分類 CRUD
  const testCategoryCrud = async () => {
    try {
      addLog('Testing Category CRUD...')

      // Create
      const newCategory: Category = {
        id: 'test-category-' + Date.now(),
        name: '測試分類',
        description: '這是一個測試分類',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:test-tube.svg?color=%23666666&width=100&height=100',
      }

      await categoryRepo.create(newCategory)
      addLog('✅ Category created')

      // Read
      const foundCategory = await categoryRepo.findById('test-category')
      addLog(`✅ Category found: ${foundCategory?.name}`)

      // Update
      if (foundCategory) {
        const updatedCategory = await categoryRepo.update('test-category', {
          name: '更新的測試分類',
        })
        addLog(`✅ Category updated: ${updatedCategory?.name}`)
      }

      // Delete
      await categoryRepo.delete('test-category')
      addLog('✅ Category deleted')

      await loadData()
    } catch (error) {
      addLog(`❌ Category CRUD error: ${error}`)
    }
  }

  // 測試帳本 CRUD
  const testAccountBookCrud = async () => {
    try {
      addLog('Testing AccountBook CRUD...')

      // Create
      const newBook: AccountBook = {
        id: 'test-book' + Date.now(),
        name: '測試帳本',
        description: '這是一個測試帳本',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        currency: 'TWD',
        ownerId: 'user-1',
        userIds: [],
      }

      await accountBookRepo.create(newBook)
      addLog('✅ AccountBook created')

      // Read
      const foundBook = await accountBookRepo.findById('test-book')
      addLog(`✅ AccountBook found: ${foundBook?.name}`)

      // Update
      if (foundBook) {
        const updatedBook = await accountBookRepo.update('test-book', {
          name: '更新的測試帳本',
          updatedAt: Date.now(),
        })
        addLog(`✅ AccountBook updated: ${updatedBook?.name}`)
      }

      // Delete
      await accountBookRepo.delete('test-book')
      addLog('✅ AccountBook deleted')

      await loadData()
    } catch (error) {
      addLog(`❌ AccountBook CRUD error: ${error}`)
    }
  }

  // 清空資料庫
  const clearDatabase = async () => {
    try {
      addLog('Clearing database...')
      await categoryRepo.clear()
      await accountBookRepo.clear()
      await loadData()
      addLog('✅ Database cleared')
    } catch (error) {
      addLog(`❌ Clear error: ${error}`)
    }
  }

  // 初始載入資料
  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Database Repository Testing</h1>

      {/* 控制按鈕 */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Button color="primary" onClick={loadData}>
          重新載入資料
        </Button>
        <Button color="success" onClick={seedMockData}>
          清除並填入測試資料
        </Button>
        <Button color="secondary" onClick={testCategoryCrud}>
          測試分類 CRUD
        </Button>
        <Button color="secondary" onClick={testAccountBookCrud}>
          測試帳本 CRUD
        </Button>
        <Button color="danger" onClick={clearDatabase}>
          清空資料庫
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 分類列表 */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">
            分類 ({categories.length})
          </h2>
          <div className="max-h-60 overflow-y-auto">
            {categories.map((category) => (
              <div key={category.id} className="border-b py-2 last:border-b-0">
                <div className="font-medium">{category.name}</div>
                <div className="text-sm text-gray-500">
                  ID: {category.id} | Type: {category.type}
                </div>
                {category.children && category.children.length > 0 && (
                  <div className="ml-4 mt-1">
                    {category.children.map((child) => (
                      <div key={child.id} className="text-sm text-gray-600">
                        └ {child.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 帳本列表 */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">
            帳本 ({accountBooks.length})
          </h2>
          <div className="max-h-60 overflow-y-auto">
            {accountBooks.map((book) => (
              <div key={book.id} className="border-b py-2 last:border-b-0">
                <div className="font-medium">{book.name}</div>
                <div className="text-sm text-gray-500">
                  ID: {book.id} | Currency: {book.currency}
                </div>
                <div className="text-sm text-gray-500">
                  Users: {book.userIds.length} | Created:{' '}
                  {new Date(book.createdAt).toLocaleDateString()}
                </div>
                {book.description && (
                  <div className="text-sm text-gray-600 mt-1">
                    {book.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 操作日誌 */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">操作日誌</h2>
          <div className="max-h-60 overflow-y-auto">
            {logs.map((log, index) => (
              <div
                key={index}
                className="text-sm py-1 border-b last:border-b-0"
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

TestDbPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}
