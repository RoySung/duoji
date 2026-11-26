import { z } from 'zod'
import { BUILTIN_CATEGORY_ICONS } from '@/constants/categoryIcons'
import type { CategoryIconKey } from '@/constants/categoryIcons'
import { TransactionType, TransactionTypeSchema } from './transaction'

export function isCustomCategoryIconUrl(value: string): boolean {
  if (!/^https:\/\/[^/\\?#]/i.test(value) || /[\s\\]/.test(value)) return false

  try {
    const url = new URL(value)
    return Boolean(url.hostname && !url.username && !url.password)
  } catch {
    return false
  }
}

export const CategoryIconSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('builtin'),
    key: z.custom<CategoryIconKey>(
      (key) =>
        typeof key === 'string' &&
        Object.prototype.hasOwnProperty.call(BUILTIN_CATEGORY_ICONS, key)
    ),
  }),
  z.object({
    kind: z.literal('custom'),
    url: z.string().refine(isCustomCategoryIconUrl),
  }),
])

export type CategoryIcon = z.infer<typeof CategoryIconSchema>

export type Category = {
  id: string
  name: string
  icon: CategoryIcon
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
  icon: CategoryIconSchema,
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
