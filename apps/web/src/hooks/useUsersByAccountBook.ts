import { useState, useEffect, useCallback } from 'react'
import { User, RegisteredUser, VirtualUser, isDeletedUser } from '@/entities/user'
import { UserLocalRepo } from '@/repositories/userRepo'
import { AccountBookLocalRepo } from '@/repositories/accountBookRepo'
import { useUserStore } from '@/stores/user'

const userRepo = new UserLocalRepo()
const accountBookRepo = new AccountBookLocalRepo()

/**
 * 根據指定的帳本 ID 取得使用者列表。
 *
 * - 若 accountBookId 與 user store 目前的 scopedAccountBookId 相同，
 *   直接使用 store 的快取，不額外查 DB。
 * - 若不同（使用者在表單內切換帳本），則向 DB 動態查詢，
 *   並在查詢期間回傳 isLoading: true。
 */
export function useUsersByAccountBook(accountBookId: string) {
  const scopedAccountBookId = useUserStore((s) => s.scopedAccountBookId)
  const storeAllUsers = useUserStore((s) => s.allUsers)
  const storeActiveUsers = useUserStore((s) => s.activeUsers)

  const isSameScope = accountBookId === scopedAccountBookId

  const [dynamicAllUsers, setDynamicAllUsers] = useState<User[]>([])
  const [dynamicActiveUsers, setDynamicActiveUsers] = useState<User[]>([])
  const [loadedBookId, setLoadedBookId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchDynamic = useCallback(
    async (signal?: { cancelled: boolean }) => {
      if (!accountBookId) return
      setIsLoading(true)
      try {
        const accountBook = await accountBookRepo.findById(accountBookId)
        if (signal?.cancelled) return

        if (!accountBook) {
          setDynamicAllUsers([])
          setDynamicActiveUsers([])
          setLoadedBookId(accountBookId)
          setIsLoading(false)
          return
        }

        const registeredUsers = await userRepo.findByIds(accountBook.userIds)
        if (signal?.cancelled) return

        const registeredUserList: User[] = registeredUsers.map((user: RegisteredUser) => ({
          ...user,
          type: 'registered' as const,
        }))

        const virtualUserList: User[] = (accountBook.virtualUsers ?? []).map(
          (v: VirtualUser) => ({
            ...v,
            type: 'virtual' as const,
          })
        )

        const allUsers = [...registeredUserList, ...virtualUserList]
        const activeUsers = allUsers.filter((u) => !isDeletedUser(u))

        if (!signal?.cancelled) {
          setDynamicAllUsers(allUsers)
          setDynamicActiveUsers(activeUsers)
          setLoadedBookId(accountBookId)
          setIsLoading(false)
        }
      } catch (error) {
        if (!signal?.cancelled) {
          setLoadedBookId(accountBookId)
          setIsLoading(false)
          console.error('Failed to fetch users by account book:', error)
        }
      }
    },
    [accountBookId]
  )

  useEffect(() => {
    if (isSameScope || !accountBookId) {
      setDynamicAllUsers([])
      setDynamicActiveUsers([])
      setLoadedBookId(null)
      setIsLoading(false)
      return
    }

    const signal = { cancelled: false }
    void fetchDynamic(signal)

    return () => {
      signal.cancelled = true
    }
  }, [accountBookId, isSameScope, fetchDynamic])

  const refetch = useCallback(() => {
    if (!isSameScope) {
      void fetchDynamic()
    }
  }, [isSameScope, fetchDynamic])

  const allUsers = isSameScope ? storeAllUsers : dynamicAllUsers
  const activeUsers = isSameScope ? storeActiveUsers : dynamicActiveUsers
  const isBookLoading =
    !isSameScope && !!accountBookId && (isLoading || loadedBookId !== accountBookId)

  return {
    allUsers,
    activeUsers,
    isLoading: isBookLoading,
    refetch,
  }
}
