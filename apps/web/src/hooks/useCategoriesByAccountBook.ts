import { useState, useEffect, useCallback, useMemo } from 'react'
import { Category } from '@/entities/category'
import { CategoryLocalRepo } from '@/repositories/categoryRepo'
import { useCategoryStore } from '@/stores/category'

// CategoryLocalRepo 是無狀態的（stateless），以 module-level singleton 共用是安全的。
const repo = new CategoryLocalRepo()

/**
 * 根據指定的帳本 ID 取得分類列表。
 *
 * - 若 accountBookId 與 category store 目前的 scopedAccountBookId 相同，
 *   直接使用 store 的快取，不額外查 DB。
 * - 若不同（使用者在表單內切換帳本），則向 DB 動態查詢，
 *   並在查詢期間回傳 isLoading: true，避免 UI 顯示空分類。
 * - 提供 refetch()，讓呼叫端在新增分類後可立即重新整理列表（
 *   例如在 isSameScope=false 時建立子分類，store 不會更新 dynamicCategories）。
 */
export function useCategoriesByAccountBook(accountBookId: string) {
  const scopedAccountBookId = useCategoryStore((s) => s.scopedAccountBookId)
  const storeCategories = useCategoryStore((s) => s.categories)

  const isSameScope = accountBookId === scopedAccountBookId

  const [dynamicCategories, setDynamicCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchDynamic = useCallback(
    (signal?: { cancelled: boolean }) => {
      if (!accountBookId) return
      setIsLoading(true)
      repo.findByAccountBookId(accountBookId)
        .then((categories) => {
          if (!signal?.cancelled) {
            setDynamicCategories(categories)
            setIsLoading(false)
          }
        })
        .catch((error) => {
          if (!signal?.cancelled) {
            setIsLoading(false)
            console.error('Failed to fetch categories:', error)
          }
        })
    },
    [accountBookId]
  )

  useEffect(() => {
    if (isSameScope || !accountBookId) {
      setDynamicCategories([])
      setIsLoading(false)
      return
    }

    const signal = { cancelled: false }
    fetchDynamic(signal)

    return () => {
      signal.cancelled = true
    }
  }, [accountBookId, isSameScope, fetchDynamic])

  const refetch = useCallback(() => {
    if (!isSameScope) {
      fetchDynamic()
    }
  }, [isSameScope, fetchDynamic])

  const categories = isSameScope ? storeCategories : dynamicCategories

  const expenseCategories = useMemo(
    () => categories.filter((c) => c.type === 'expense'),
    [categories]
  )

  const incomeCategories = useMemo(
    () => categories.filter((c) => c.type === 'income'),
    [categories]
  )

  return {
    categories,
    expenseCategories,
    incomeCategories,
    isLoading: !isSameScope && isLoading,
    refetch,
  }
}
