import { buildExportFilename, downloadCsv, transactionsToCsv } from './csvExport'
import { Category } from '@/entities/category'
import { Transaction } from '@/entities/transaction'

const baseTransaction: Transaction = {
  id: 'tx-1',
  type: 'expense',
  accountBookId: 'ab-1',
  categoryId: 'cat-1',
  amount: 100,
  date: '2024/01/15',
  description: 'Lunch',
  paymentMethod: 'Cash',
  receivedByUserId: null,
  tags: [],
  paidByDetail: [],
  splitDetail: [],
  settlementRecordId: '__unsettled__',
  createdAt: 0,
  updatedAt: 0,
  deletedAt: null,
}

const baseCategory: Category = {
  id: 'cat-1',
  name: 'Food',
  imageUrl: 'https://example.com/food.png',
  description: '',
  type: 'expense',
  parentId: null,
  accountBookId: 'ab-1',
  sortOrder: 0,
}

describe('transactionsToCsv', () => {
  it('outputs header row', () => {
    const csv = transactionsToCsv([], [])
    expect(csv).toBe('Date,Type,Category,Amount,Payment Method,Description')
  })

  it('maps a basic transaction to a CSV row', () => {
    const csv = transactionsToCsv([baseTransaction], [baseCategory])
    const rows = csv.split('\n')
    expect(rows[1]).toBe('2024/01/15,expense,Food,100,Cash,Lunch')
  })

  it('resolves category name from category list', () => {
    const csv = transactionsToCsv([baseTransaction], [baseCategory])
    expect(csv).toContain('Food')
  })

  it('falls back to categoryId when category not found', () => {
    const csv = transactionsToCsv([baseTransaction], [])
    expect(csv).toContain('cat-1')
  })

  it('excludes soft-deleted transactions', () => {
    const deleted = { ...baseTransaction, deletedAt: 1234567890 }
    const csv = transactionsToCsv([deleted], [baseCategory])
    const rows = csv.split('\n')
    expect(rows).toHaveLength(1)
  })

  it('escapes commas in description', () => {
    const tx = { ...baseTransaction, description: 'Lunch, dinner' }
    const csv = transactionsToCsv([tx], [baseCategory])
    expect(csv).toContain('"Lunch, dinner"')
  })

  it('escapes double quotes in description', () => {
    const tx = { ...baseTransaction, description: 'Say "hi"' }
    const csv = transactionsToCsv([tx], [baseCategory])
    expect(csv).toContain('"Say ""hi"""')
  })

  it('escapes newlines in description', () => {
    const tx = { ...baseTransaction, description: 'line1\nline2' }
    const csv = transactionsToCsv([tx], [baseCategory])
    expect(csv).toContain('"line1\nline2"')
  })

  it('handles multiple transactions in order', () => {
    const tx2: Transaction = { ...baseTransaction, id: 'tx-2', date: '2024/01/16', amount: 200 }
    const csv = transactionsToCsv([baseTransaction, tx2], [baseCategory])
    const rows = csv.split('\n')
    expect(rows).toHaveLength(3)
    expect(rows[1]).toContain('2024/01/15')
    expect(rows[2]).toContain('2024/01/16')
  })
})

describe('buildExportFilename', () => {
  it('returns a filename matching transactions-YYYY-MM-DD.csv', () => {
    const filename = buildExportFilename()
    expect(filename).toMatch(/^transactions-\d{4}-\d{2}-\d{2}\.csv$/)
  })
})

describe('downloadCsv', () => {
  it('creates an anchor and triggers a click', () => {
    const mockClick = jest.fn()
    const mockAnchor = {
      href: '',
      download: '',
      click: mockClick,
    }
    jest.spyOn(document, 'createElement').mockReturnValueOnce(mockAnchor as unknown as HTMLAnchorElement)
    const mockUrl = 'blob:mock'
    global.URL.createObjectURL = jest.fn().mockReturnValue(mockUrl)
    global.URL.revokeObjectURL = jest.fn()

    downloadCsv('a,b\n1,2', 'test.csv')

    expect(mockAnchor.download).toBe('test.csv')
    expect(mockAnchor.href).toBe(mockUrl)
    expect(mockClick).toHaveBeenCalledTimes(1)
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(mockUrl)
  })
})
