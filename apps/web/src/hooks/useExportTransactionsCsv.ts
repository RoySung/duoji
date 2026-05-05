import { useCallback } from 'react'
import { Category } from '@/entities/category'
import { Transaction } from '@/entities/transaction'
import {
  buildExportFilename,
  downloadCsv,
  transactionsToCsv,
} from '@/utils/csvExport'

export function useExportTransactionsCsv(
  transactions: Transaction[],
  categories: Category[]
) {
  const exportCsv = useCallback(() => {
    const csv = transactionsToCsv(transactions, categories)
    downloadCsv(csv, buildExportFilename())
  }, [transactions, categories])

  return { exportCsv }
}
