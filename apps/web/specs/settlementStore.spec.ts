import { renderHook, waitFor, act } from '@testing-library/react'
import { Transaction, UNSETTLED_SETTLEMENT_RECORD_ID } from '../src/entities/transaction'
import { SettlementRecord, SettlementRepo } from '../src/entities/settlement'
import { userList } from './fixtures'
import { useSettlement } from '../src/hooks/useSettlement'

jest.mock('../src/utils/genUuid', () => {
  let counter = 0

  return {
    genUuid: jest.fn(() => `uuid-${++counter}`),
  }
})

const baseTimestamp = 1710000000000

function createTransactionFixture(
  overrides: Partial<Transaction> = {}
): Transaction {
  const type = overrides.type ?? 'expense'

  return {
    id: 'tx-1',
    type,
    accountBookId: 'book-1',
    categoryId: type === 'income' ? '101-1' : '1-1',
    amount: 120,
    date: '2026/03/18',
    description: 'Breakfast with friends',
    paymentMethod: 'Cash',
    receivedByUserId: type === 'income' ? userList[0]?.id ?? null : null,
    settlementRecordId: UNSETTLED_SETTLEMENT_RECORD_ID,
    tags: ['meal'],
    paidByDetail: [
      {
        userId: userList[0]!.id,
        userType: 'registered',
        amount: 120,
      },
    ],
    splitDetail: [
      {
        userId: userList[0]!.id,
        userType: 'registered',
        amount: 60,
      },
      {
        userId: userList[1]!.id,
        userType: 'registered',
        amount: 60,
      },
    ],
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
    deletedAt: null,
    ...overrides,
  }
}

class InMemorySettlementRepo implements SettlementRepo {
  private records: SettlementRecord[]

  constructor(records: SettlementRecord[] = []) {
    this.records = [...records]
  }

  async create(record: SettlementRecord): Promise<SettlementRecord> {
    this.records.push(record)
    return record
  }

  async findById(id: string): Promise<SettlementRecord | null> {
    return this.records.find((record) => record.id === id) ?? null
  }

  async findByAccountBookId(
    accountBookId: string
  ): Promise<SettlementRecord[]> {
    return this.records.filter(
      (record) => record.accountBookId === accountBookId
    )
  }

  async update(
    id: string,
    updates: Partial<SettlementRecord>
  ): Promise<SettlementRecord | null> {
    const index = this.records.findIndex((record) => record.id === id)

    if (index === -1) {
      return null
    }

    const updatedRecord = {
      ...this.records[index],
      ...updates,
    }

    this.records[index] = updatedRecord
    return updatedRecord
  }
}

describe('useSettlement', () => {
  it('derives unsettled expense transactions', async () => {
    const repo = new InMemorySettlementRepo()
    const transactions = [
      createTransactionFixture({ id: 'tx-unsettled' }),
      createTransactionFixture({
        id: 'tx-settled',
        settlementRecordId: 'record-1',
      }),
      createTransactionFixture({
        id: 'tx-income',
        type: 'income',
        categoryId: '101-1',
        receivedByUserId: userList[0]!.id,
      }),
      createTransactionFixture({
        id: 'tx-deleted',
        deletedAt: baseTimestamp + 1000,
      }),
    ]

    const { result } = renderHook(() =>
      useSettlement('book-1', transactions, repo)
    )

    await waitFor(() => {
      expect(result.current.memberStatuses).toHaveLength(2)
    })

    expect(result.current.transferSuggestions).toHaveLength(1)
    expect(result.current.transferSuggestions[0]).toMatchObject({
      fromUserId: userList[1]!.id,
      toUserId: userList[0]!.id,
      suggestedAmount: 60,
    })
  })

  it('creates a settlement record and clears member statuses', async () => {
    const repo = new InMemorySettlementRepo()
    const transactions = [
      createTransactionFixture({ id: 'tx-1' }),
      createTransactionFixture({
        id: 'tx-2',
        description: 'Dinner',
        amount: 240,
        paidByDetail: [
          {
            userId: userList[1]!.id,
            userType: 'registered',
            amount: 240,
          },
        ],
        splitDetail: [
          {
            userId: userList[0]!.id,
            userType: 'registered',
            amount: 120,
          },
          {
            userId: userList[1]!.id,
            userType: 'registered',
            amount: 120,
          },
        ],
      }),
      createTransactionFixture({
        id: 'tx-income',
        type: 'income',
        categoryId: '101-1',
        receivedByUserId: userList[0]!.id,
      }),
    ]

    const { result } = renderHook(() =>
      useSettlement('book-1', transactions, repo)
    )

    await waitFor(() => {
      expect(result.current.memberStatuses).toHaveLength(2)
    })

    await act(async () => {
      await result.current.createSettlementRecord(transactions)
    })

    expect(result.current.records).toHaveLength(1)
    expect(result.current.records[0]).toMatchObject({ id: 'uuid-1' })
    expect(result.current.memberStatuses).toHaveLength(0)
    expect(result.current.transferSuggestions).toHaveLength(0)
  })
})
