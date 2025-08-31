import { z } from 'zod'
import { UserSchema } from './user'

const PaidByDetailSchema = z.array(
  z.object({
    user: UserSchema,
    amount: z.number().positive(),
  })
)

const SplitDetailSchema = z.array(
  z.object({
    user: UserSchema,
    amount: z.number().positive(),
  })
)

export const ExpenseSchema = z.object({
  amount: z.number().positive(),
  accountBookId: z.string().nullable(),
  categoryId: z.string(),
  date: z
    .string()
    .regex(/^\d{4}\/\d{2}\/\d{2}$/, 'Date must be in YYYY/MM/DD format'),
  description: z.string(),
  tags: z.array(z.string()),
  paidByDetail: PaidByDetailSchema,
  splitDetail: SplitDetailSchema,
})

export type Category = {
  id: string
  name: string
  imageUrl: string
  description: string
  type: 'expense' | 'income'
  children?: Category[]
}

export const CategorySchema: z.ZodType<Category> = z.object({
  id: z.string(),
  name: z.string(),
  imageUrl: z.url(),
  description: z.string(),
  type: z.enum(['expense', 'income']),
  children: z.array(z.lazy(() => CategorySchema)).optional(),
})

export type Expense = z.infer<typeof ExpenseSchema>
export type PaidByDetail = z.infer<typeof PaidByDetailSchema>
export type SplitDetail = z.infer<typeof SplitDetailSchema>

// Category Repository 介面定義
export interface CategoryRepo {
  create(category: Category, parentId?: string): Promise<Category>
  findById(id: string): Promise<Category | null>
  findAll(): Promise<Category[]>
  findByParent(parentId: string | null): Promise<Category[]>
  findListByType(type: 'expense' | 'income'): Promise<Category[]>
  update(id: string, category: Partial<Category>): Promise<Category | null>
  delete(id: string): Promise<boolean>
}
