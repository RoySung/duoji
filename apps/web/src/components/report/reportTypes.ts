import { Transaction, TransactionType } from '@/entities/transaction'

export type TimeRangePreset = 'thisWeek' | 'month' | '3m' | '1y' | 'all'

export type CategorySummary = {
  key: string
  displayName: string
  imageUrl: string | null
  totalAmount: number
  transactionCount: number
  percentage: number
  transactions: Transaction[]
}

export type CurrencyGroup = {
  currency: string
  transactions: Transaction[]
}

export type MonthlyTrendPoint = {
  month: string
  income: number
  expense: number
}

export type SummaryTotals = {
  income: number
  expense: number
  net: number
}

export type CategoryAggregateOptions = {
  mergeByName: boolean
}

export type { TransactionType }
