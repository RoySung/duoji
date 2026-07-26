import React, { type ReactNode } from 'react'
import { act, renderHook, waitFor } from '@testing-library/react'
import { UserStoreProvider, createUserStore } from '../src/stores/user'
import { useUsersByAccountBook } from '../src/hooks/useUsersByAccountBook'
import { db } from '../src/lib/dexie'
import { userList } from './fixtures'
import { AccountBook } from '../src/entities/accountBook'

const baseTimestamp = 1710000000000

const mockAccountBook: AccountBook = {
  id: 'book-target',
  name: 'Target Book',
  currency: 'TWD',
  description: '',
  createdAt: baseTimestamp,
  updatedAt: baseTimestamp,
  ownerId: userList[0]!.id,
  userIds: [userList[0]!.id, userList[1]!.id],
  virtualUsers: [
    {
      id: 'vu-target-1',
      name: 'Target Virtual User',
      accountBookId: 'book-target',
      createdAt: baseTimestamp,
      updatedAt: baseTimestamp,
    },
  ],
}

describe('useUsersByAccountBook', () => {
  beforeEach(async () => {
    await db.open()
    await db.accountBooks.put(mockAccountBook)
    for (const u of userList) {
      await db.users.put(u)
    }
  })

  afterEach(async () => {
    db.close()
    await db.delete()
  })

  it('should dynamically query users from IndexedDB when scope is different from store', async () => {
    const store = createUserStore()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <UserStoreProvider store={store}>{children}</UserStoreProvider>
    )

    const { result } = renderHook(() => useUsersByAccountBook('book-target'), {
      wrapper,
    })

    // Initially, it should be loading
    expect(result.current.isLoading).toBe(true)

    // Wait for the asynchronous fetch to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.allUsers.length).toBe(3) // 2 registered + 1 virtual
    expect(result.current.allUsers.map((u) => u.id)).toContain('vu-target-1')
    expect(result.current.activeUsers.length).toBe(3)
  })

  it('should immediately set isLoading to true when switching to another accountBookId', async () => {
    const store = createUserStore()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <UserStoreProvider store={store}>{children}</UserStoreProvider>
    )

    let currentBookId = 'book-target'
    const { result, rerender } = renderHook(() => useUsersByAccountBook(currentBookId), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Rerender with new accountBookId
    currentBookId = 'book-other'
    rerender()

    // It should immediately be loading before async fetch completes
    expect(result.current.isLoading).toBe(true)
  })
})
