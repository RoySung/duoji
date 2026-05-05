import dayjs from 'dayjs'
import { Category } from '@/entities/category'
import { Transaction } from '@/entities/transaction'

function escapeCsvField(value: string): string {
  if (value.includes('"') || value.includes(',') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function transactionsToCsv(
  transactions: Transaction[],
  categories: Category[]
): string {
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]))

  const header = 'Date,Type,Category,Amount,Payment Method,Description'

  const rows = transactions
    .filter((tx) => tx.deletedAt === null)
    .map((tx) => {
      const categoryName = categoryMap.get(tx.categoryId) ?? tx.categoryId
      return [
        escapeCsvField(tx.date),
        escapeCsvField(tx.type),
        escapeCsvField(categoryName),
        String(tx.amount),
        escapeCsvField(tx.paymentMethod),
        escapeCsvField(tx.description),
      ].join(',')
    })

  return [header, ...rows].join('\n')
}

export function downloadCsv(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export function buildExportFilename(): string {
  return `transactions-${dayjs().format('YYYY-MM-DD')}.csv`
}
