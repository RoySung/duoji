import { VirtualUserSchema, isSharedWalletUser, User } from '../src/entities/user'

const baseTimestamp = 1710000000000

describe('VirtualUserSchema — isSharedWallet field', () => {
  it('defaults isSharedWallet to undefined when not provided', () => {
    const result = VirtualUserSchema.parse({
      id: 'vu-1',
      name: 'Alice',
      accountBookId: 'book-1',
      createdAt: baseTimestamp,
      updatedAt: baseTimestamp,
    })

    expect(result.isSharedWallet).toBeUndefined()
  })

  it('accepts isSharedWallet: true', () => {
    const result = VirtualUserSchema.parse({
      id: 'vu-shared',
      name: 'Shared Wallet',
      accountBookId: 'book-1',
      isSharedWallet: true,
      createdAt: baseTimestamp,
      updatedAt: baseTimestamp,
    })

    expect(result.isSharedWallet).toBe(true)
  })

  it('accepts isSharedWallet: false', () => {
    const result = VirtualUserSchema.parse({
      id: 'vu-2',
      name: 'Bob',
      accountBookId: 'book-1',
      isSharedWallet: false,
      createdAt: baseTimestamp,
      updatedAt: baseTimestamp,
    })

    expect(result.isSharedWallet).toBe(false)
  })
})

describe('isSharedWalletUser', () => {
  it('returns true for a virtual user with isSharedWallet: true', () => {
    const user: User = {
      id: 'vu-shared',
      name: 'Shared Wallet',
      accountBookId: 'book-1',
      type: 'virtual',
      isSharedWallet: true,
      createdAt: baseTimestamp,
      updatedAt: baseTimestamp,
    }

    expect(isSharedWalletUser(user)).toBe(true)
  })

  it('returns false for a virtual user without isSharedWallet', () => {
    const user: User = {
      id: 'vu-1',
      name: 'Alice',
      accountBookId: 'book-1',
      type: 'virtual',
      createdAt: baseTimestamp,
      updatedAt: baseTimestamp,
    }

    expect(isSharedWalletUser(user)).toBe(false)
  })

  it('returns false for a registered user', () => {
    const user: User = {
      id: 'u-1',
      name: 'Roy',
      email: 'roy@example.com',
      avatarUrl: 'https://example.com/avatar.png',
      type: 'registered',
      createdAt: baseTimestamp,
      updatedAt: baseTimestamp,
    }

    expect(isSharedWalletUser(user)).toBe(false)
  })
})
