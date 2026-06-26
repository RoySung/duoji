
import {
  computeMemberStatuses,
  computeMinimumTransfers,
  computeSharedWalletSummary,
} from './settlementUtils'
import { Transaction } from '@/entities/transaction'

describe('settlementUtils', () => {
  describe('computeMemberStatuses & computeMinimumTransfers', () => {
    it('should exclude shared wallet from peer-to-peer transfers', () => {
      const swId = 'sw-1'
      const txns: Transaction[] = [
        {
          id: 'tx-1',
          type: 'expense',
          amount: 100,
          paidByDetail: [{ userId: swId, amount: 60 }, { userId: 'user-a', amount: 40 }],
          splitDetail: [{ userId: 'user-a', amount: 50 }, { userId: 'user-b', amount: 50 }],
          deletedAt: null,
          settlementRecordId: 'unsettled',
        } as Transaction,
      ]

      const sharedWalletIds = new Set([swId])
      const statuses = computeMemberStatuses(txns, sharedWalletIds, 3)

      const aStatus = statuses.find(s => s.userId === 'user-a')
      const bStatus = statuses.find(s => s.userId === 'user-b')

      // A's split is 50. SW paid 60 (60% of total 100). A's share of SW payment is 60 * (50/100) = 30.
      // So A's effective split is 50 - 30 = 20.
      // A paid 40. A's net = 40 - 20 = 20 (owed money).
      expect(aStatus?.netAmount).toBe(20)

      // B's split is 50. SW paid 60. B's share of SW payment is 30.
      // B's effective split is 50 - 30 = 20.
      // B paid 0. B's net = 0 - 20 = -20 (owes money).
      expect(bStatus?.netAmount).toBe(-20)

      const transfers = computeMinimumTransfers(statuses)
      expect(transfers.length).toBe(1)
      expect(transfers[0].fromUserId).toBe('user-b')
      expect(transfers[0].toUserId).toBe('user-a')
      expect(transfers[0].suggestedAmount).toBe(20)
    })
  })

  describe('computeSharedWalletSummary', () => {
    it('should correctly calculate subset borrowings', () => {
      const swId = 'sw-1'
      const txns: Transaction[] = [
        {
          id: 'tx-1',
          type: 'expense',
          amount: 100,
          paidByDetail: [{ userId: swId, amount: 100 }],
          splitDetail: [{ userId: 'user-a', amount: 50 }, { userId: 'user-b', amount: 50 }],
          deletedAt: null,
          settlementRecordId: 'unsettled',
        } as Transaction,
      ]

      const sharedWalletIds = new Set([swId])
      // Total real members = 3. This is a subset split.
      const summary = computeSharedWalletSummary(txns, sharedWalletIds, 3)

      expect(summary.totalExpense).toBe(100)
      expect(summary.averagePerPerson).toBe(0)
      expect(summary.borrowings.length).toBe(2)
      
      const borrowA = summary.borrowings.find(b => b.userId === 'user-a')
      const borrowB = summary.borrowings.find(b => b.userId === 'user-b')

      expect(borrowA?.amount).toBe(50)
      expect(borrowB?.amount).toBe(50)
    })

    it('should ignore whole group split from borrowings', () => {
      const swId = 'sw-1'
      const txns: Transaction[] = [
        {
          id: 'tx-1',
          type: 'expense',
          amount: 90,
          paidByDetail: [{ userId: swId, amount: 90 }],
          splitDetail: [
            { userId: 'user-a', amount: 30 },
            { userId: 'user-b', amount: 30 },
            { userId: 'user-c', amount: 30 },
          ],
          deletedAt: null,
          settlementRecordId: 'unsettled',
        } as Transaction,
      ]

      const sharedWalletIds = new Set([swId])
      // Total real members = 3. This is an ALL split.
      const summary = computeSharedWalletSummary(txns, sharedWalletIds, 3)

      expect(summary.totalExpense).toBe(90)
      expect(summary.averagePerPerson).toBe(30)
      expect(summary.borrowings.length).toBe(0) // No borrowings
    })
  })
})
