import { User } from './user'

export type Currency = 'USD' | 'JPY' | 'TWD'
export type AccountBook = {
  id: string
  name: string
  currency: Currency
  description: string
  createdAt: number
  updatedAt: number
  users: User[]
}
