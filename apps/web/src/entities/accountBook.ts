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

export interface AccountBookRepo {
  create(accountBook: AccountBook): Promise<AccountBook>
  findById(id: string): Promise<AccountBook | null>
  findAll(): Promise<AccountBook[]>
  update(
    id: string,
    accountBook: Partial<AccountBook>
  ): Promise<AccountBook | null>
  delete(id: string): Promise<boolean>
}
