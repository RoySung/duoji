import { User } from './user'

export type Expense = {
  amount: number
  accountBookId: string | null
  categoryId: string
  date: string // e.g. '2023/10/01'
  description: string
  tags: string[]
  paidByDetail: PaidByDetail
  splitDetail: SplitDetail
}

type PaidByDetail = Array<{
  user: User
  amount: number
}>
type SplitDetail = Array<{
  user: User
  amount: number
}>

export type Category = {
  id: string
  name: string
  imageUrl: string
  description: string
  children?: Category[]
}
