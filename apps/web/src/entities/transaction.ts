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

export const CategoryTypeSchema = z.enum(['income', 'expense'])
export type CategoryType = z.infer<typeof CategoryTypeSchema>

export type Category = {
  id: string
  name: string
  imageUrl: string
  description: string
  type: CategoryType
  parentId: string | null
  children?: Category[]
}

export const CategorySchema: z.ZodType<Category> = z.object({
  id: z.string(),
  name: z.string(),
  imageUrl: z.url(),
  description: z.string(),
  type: CategoryTypeSchema,
  parentId: z.string().nullable(),
  children: z.array(z.lazy(() => CategorySchema)).optional(),
})

export type Expense = z.infer<typeof ExpenseSchema>
export type PaidByDetail = z.infer<typeof PaidByDetailSchema>
export type SplitDetail = z.infer<typeof SplitDetailSchema>

// CategoryRepository 介面定義
export interface CategoryRepository {
  // 標準 CRUD 操作
  create(category: Category): Promise<Category>
  findById(id: string): Promise<Category | null>
  findAll(): Promise<Category[]>
  update(id: string, category: Partial<Category>): Promise<Category | null>
  delete(id: string): Promise<boolean>
  
  // 階層分類特有方法
  findByParent(parentId: string | null): Promise<Category[]>
  getTreeStructure(): Promise<Category[]>
  findByName(name: string): Promise<Category[]>
  getAllLeafCategories(): Promise<Category[]>
  findByType(type: CategoryType): Promise<Category[]>
}
