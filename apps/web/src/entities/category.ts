import { z } from 'zod'
import { TransactionType, TransactionTypeSchema } from './transaction'

export type Category = {
  id: string
  name: string
  imageUrl: string
  description: string
  type: TransactionType
  parentId: string | null
  accountBookId: string
  sortOrder: number
}

export type CategoryBulkError = {
  id: string
  message: string
}

export type CategoryBulkResult<TKey extends string, TValue> = {
  [K in TKey]: TValue[]
} & {
  failedIds: string[]
  errors: CategoryBulkError[]
}

export type CategoryBulkCreateInput = Category
export type CategoryBulkCreateResult = CategoryBulkResult<'created', Category>

export type CategoryBulkUpdateInput = {
  id: string
  changes: Partial<Category>
}
export type CategoryBulkUpdateResult = CategoryBulkResult<'updated', Category>

export type CategoryBulkDeleteResult = CategoryBulkResult<'deletedIds', string>

export const CategorySchema: z.ZodType<Category> = z.object({
  id: z.string(),
  name: z.string(),
  imageUrl: z.url(),
  description: z.string(),
  type: TransactionTypeSchema,
  parentId: z.string().nullable(),
  accountBookId: z.string(),
  sortOrder: z.number(),
})

export interface CategoryRepo {
  create(category: Category, parentId?: string): Promise<Category>
  bulkCreate(
    categories: CategoryBulkCreateInput[]
  ): Promise<CategoryBulkCreateResult>
  findById(id: string): Promise<Category | null>
  findAll(): Promise<Category[]>
  findByParent(parentId: string | null): Promise<Category[]>
  findListByType(type: TransactionType): Promise<Category[]>
  findByAccountBookId(accountBookId: string): Promise<Category[]>
  update(id: string, category: Partial<Category>): Promise<Category | null>
  bulkUpdate(
    updates: CategoryBulkUpdateInput[]
  ): Promise<CategoryBulkUpdateResult>
  delete(id: string): Promise<boolean>
  bulkDelete(ids: string[]): Promise<CategoryBulkDeleteResult>
  clear(): Promise<void>
}
