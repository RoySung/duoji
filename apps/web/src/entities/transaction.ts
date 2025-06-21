import { User } from './user'

export type Expense = {
  amount: number
  accountBookId: string | null
  date: string // e.g. '2023/10/01'
  description: string
  tags: string[]
  paidByDetail: Array<{
    user: User
    amount: number
  }>
  splitDetail: Array<{
    user: User
    amount: number
  }>
}
