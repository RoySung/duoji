import { createStore } from 'zustand/vanilla'
import { devtools } from 'zustand/middleware'
import {
  Category,
  CategoryBulkCreateResult,
  CategoryBulkDeleteResult,
  CategoryBulkUpdateInput,
  CategoryBulkUpdateResult,
  CategoryRepo,
} from '@/entities/category'
import { CategoryLocalRepo } from '@/repositories/categoryRepo'
import {
  getDefaultExpenseCategories,
  getDefaultIncomeCategories,
} from '@/constants/defaultCategories'
import { genUuid } from '@/utils/genUuid'
import type { Language } from '@/entities/settings'

type CategoryStoreState = {
  categories: Category[]
  expenseCategories: Category[]
  incomeCategories: Category[]
  scopedAccountBookId: string | null
  initialized: boolean
  isLoading: boolean
  error: string | null
}

type CategoryCreateInput = Omit<Category, 'id' | 'sortOrder'> & {
  id?: string
  sortOrder?: number
}

type CategoryStoreActions = {
  initialize: (accountBookId: string | null) => Promise<void>
  seedDefaultCategories: (
    accountBookId: string,
    locale?: Language
  ) => Promise<void>
  addCategory: (payload: CategoryCreateInput) => Promise<Category>
  bulkCreate: (
    payloads: CategoryCreateInput[]
  ) => Promise<CategoryBulkCreateResult>
  updateCategory: (id: string, changes: Partial<Category>) => Promise<boolean>
  bulkUpdate: (
    updates: CategoryBulkUpdateInput[]
  ) => Promise<CategoryBulkUpdateResult>
  deleteCategory: (id: string) => Promise<boolean>
  bulkDelete: (ids: string[]) => Promise<CategoryBulkDeleteResult>
  resetInMemoryState: () => void
}

export type CategoryStore = CategoryStoreState & CategoryStoreActions
export type CategoryStoreApi = ReturnType<typeof createCategoryStore>

const initialCategoryStoreState: CategoryStoreState = {
  categories: [],
  expenseCategories: [],
  incomeCategories: [],
  scopedAccountBookId: null,
  initialized: false,
  isLoading: false,
  error: null,
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unknown category error'
}

function deriveCategories(
  categories: Category[]
): Pick<CategoryStoreState, 'expenseCategories' | 'incomeCategories'> {
  return {
    expenseCategories: categories.filter((c) => c.type === 'expense'),
    incomeCategories: categories.filter((c) => c.type === 'income'),
  }
}

function getCategoryScopeKey(
  accountBookId: string,
  parentId: string | null
): string {
  return `${accountBookId}::${parentId ?? 'root'}`
}

export function createCategoryStore(
  categoryRepo: CategoryRepo = new CategoryLocalRepo(),
  initialState: Partial<CategoryStoreState> = {}
) {
  return createStore<CategoryStore>()(
    devtools(
      (set, get) => ({
        ...initialCategoryStoreState,
        ...initialState,

        initialize: async (accountBookId) => {
          if (!accountBookId) {
            set({
              categories: [],
              expenseCategories: [],
              incomeCategories: [],
              scopedAccountBookId: null,
              initialized: true,
              isLoading: false,
              error: null,
            })
            return
          }

          set({ isLoading: true, error: null })

          try {
            let categories =
              accountBookId === 'all'
                ? await categoryRepo.findAll()
                : await categoryRepo.findByAccountBookId(accountBookId)

            // 'all' is a read-only aggregate view; no specific account book to seed defaults into.
            if (accountBookId !== 'all' && categories.length === 0) {
              await get().seedDefaultCategories(accountBookId)
              categories = await categoryRepo.findByAccountBookId(accountBookId)
            }

            set({
              categories,
              ...deriveCategories(categories),
              scopedAccountBookId: accountBookId,
              initialized: true,
              isLoading: false,
              error: null,
            })
          } catch (error) {
            set({
              isLoading: false,
              error: toErrorMessage(error),
            })
          }
        },

        seedDefaultCategories: async (accountBookId, locale = 'en-US') => {
          const expenseCategories = getDefaultExpenseCategories(
            accountBookId,
            locale
          )
          const incomeCategories = getDefaultIncomeCategories(
            accountBookId,
            locale,
            expenseCategories.length
          )

          await categoryRepo.bulkCreate([
            ...expenseCategories,
            ...incomeCategories,
          ])
        },

        resetInMemoryState: () => {
          set(initialCategoryStoreState)
        },

        addCategory: async (payload) => {
          const id = genUuid()
          let sortOrder = payload.sortOrder
          if (sortOrder === undefined) {
            const existing = await categoryRepo.findByAccountBookId(
              get().scopedAccountBookId ?? payload.accountBookId
            )
            const sameScopeItems = existing.filter(
              (c) => c.parentId === (payload.parentId ?? null)
            )
            const maxOrder = sameScopeItems.reduce(
              (max, c) => (c.sortOrder > max ? c.sortOrder : max),
              -1
            )
            sortOrder = maxOrder + 1
          }
          const category: Category = { ...payload, id, sortOrder }
          const created = await categoryRepo.create(category)
          const categories = await categoryRepo.findByAccountBookId(
            get().scopedAccountBookId ?? payload.accountBookId
          )
          set({ categories, ...deriveCategories(categories) })
          return created
        },

        bulkCreate: async (payloads) => {
          if (payloads.length === 0) {
            return {
              created: [],
              failedIds: [],
              errors: [],
            }
          }

          const accountBookIds = [
            ...new Set(payloads.map((payload) => payload.accountBookId)),
          ]
          const existingEntries = await Promise.all(
            accountBookIds.map(
              async (accountBookId) =>
                [
                  accountBookId,
                  await categoryRepo.findByAccountBookId(accountBookId),
                ] as const
            )
          )
          const existingByAccountBook = new Map(existingEntries)
          const nextSortOrderByScope = new Map<string, number>()

          for (const [accountBookId, categories] of existingByAccountBook) {
            for (const category of categories) {
              const scopeKey = getCategoryScopeKey(
                accountBookId,
                category.parentId ?? null
              )
              const currentMax = nextSortOrderByScope.get(scopeKey) ?? -1
              nextSortOrderByScope.set(
                scopeKey,
                Math.max(currentMax, category.sortOrder)
              )
            }
          }

          const categoriesToCreate: Category[] = payloads.map((payload) => {
            const scopeKey = getCategoryScopeKey(
              payload.accountBookId,
              payload.parentId ?? null
            )
            const currentMax = nextSortOrderByScope.get(scopeKey) ?? -1
            const nextSortOrder = payload.sortOrder ?? currentMax + 1

            nextSortOrderByScope.set(
              scopeKey,
              Math.max(currentMax, nextSortOrder)
            )

            return {
              ...payload,
              id: payload.id ?? genUuid(),
              sortOrder: nextSortOrder,
            }
          })

          const result = await categoryRepo.bulkCreate(categoriesToCreate)
          const refreshAccountBookId =
            get().scopedAccountBookId ?? payloads[0]?.accountBookId ?? null

          if (refreshAccountBookId) {
            const categories = await categoryRepo.findByAccountBookId(
              refreshAccountBookId
            )
            set({ categories, ...deriveCategories(categories) })
          }

          return result
        },

        updateCategory: async (id, changes) => {
          const updated = await categoryRepo.update(id, changes)
          if (!updated) return false
          const categories = await categoryRepo.findByAccountBookId(
            get().scopedAccountBookId ?? updated.accountBookId
          )
          set({ categories, ...deriveCategories(categories) })
          return true
        },

        bulkUpdate: async (updates) => {
          if (updates.length === 0) {
            return {
              updated: [],
              failedIds: [],
              errors: [],
            }
          }

          const result = await categoryRepo.bulkUpdate(updates)
          const refreshAccountBookId =
            get().scopedAccountBookId ??
            result.updated[0]?.accountBookId ??
            null

          if (refreshAccountBookId) {
            const categories = await categoryRepo.findByAccountBookId(
              refreshAccountBookId
            )
            set({ categories, ...deriveCategories(categories) })
          }

          return result
        },

        deleteCategory: async (id) => {
          const deleted = await categoryRepo.delete(id)
          if (!deleted) return false
          const scopedId = get().scopedAccountBookId
          if (scopedId) {
            const categories = await categoryRepo.findByAccountBookId(scopedId)
            set({ categories, ...deriveCategories(categories) })
          }
          return true
        },

        bulkDelete: async (ids) => {
          if (ids.length === 0) {
            return {
              deletedIds: [],
              failedIds: [],
              errors: [],
            }
          }

          let refreshAccountBookId = get().scopedAccountBookId

          if (!refreshAccountBookId) {
            for (const id of ids) {
              const category = await categoryRepo.findById(id)
              if (category) {
                refreshAccountBookId = category.accountBookId
                break
              }
            }
          }

          const result = await categoryRepo.bulkDelete(ids)

          if (refreshAccountBookId) {
            const categories = await categoryRepo.findByAccountBookId(
              refreshAccountBookId
            )
            set({ categories, ...deriveCategories(categories) })
          }

          return result
        },
      }),
      { name: 'CategoryStore' }
    )
  )
}
