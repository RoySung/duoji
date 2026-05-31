import {
  DefaultPaymentMethod,
  isUnsettledSettlementRecordId,
  Transaction,
  TransactionSchema,
  UNSETTLED_SETTLEMENT_RECORD_ID,
} from '../src/entities/transaction'
import { db } from '../src/lib/dexie'
import { userList } from './fixtures'
import TransactionLocalRepo from '../src/repositories/transactionRepo/transactionLocalRepo'

const baseTimestamp = 1710000000000

function createTransactionFixture(
  overrides: Partial<Transaction> = {}
): Transaction {
  const type = overrides.type ?? 'expense'

  return {
    id: 'tx-1',
    type,
    accountBookId: '1',
    categoryId: type === 'income' ? '101-1' : '1-1',
    amount: 120,
    date: '2026/03/18',
    description: 'Breakfast with friends',
    paymentMethod: DefaultPaymentMethod,
    receivedByUserId: type === 'income' ? userList[0]?.id ?? null : null,
    settlementRecordId: UNSETTLED_SETTLEMENT_RECORD_ID,
    tags: ['meal'],
    paidByDetail: [
      {
        userId: userList[0]!.id,
        userType: 'registered' as const,
        amount: 120,
      },
    ],
    splitDetail: [
      {
        userId: userList[0]!.id,
        userType: 'registered' as const,
        amount: 60,
      },
      {
        userId: userList[1]!.id,
        userType: 'registered' as const,
        amount: 60,
      },
    ],
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
    deletedAt: null,
    ...overrides,
  }
}

describe('TransactionLocalRepo', () => {
  let repo: TransactionLocalRepo

  beforeEach(async () => {
    await db.delete()
    await db.open()

    repo = new TransactionLocalRepo()
  })

  afterAll(async () => {
    await db.delete()
  })

  it('should validate transaction fixtures against the Zod schema', () => {
    expect(() =>
      TransactionSchema.parse(createTransactionFixture())
    ).not.toThrow()
  })

  it('should default new transaction fixtures to the unsettled sentinel', () => {
    expect(
      isUnsettledSettlementRecordId(
        createTransactionFixture().settlementRecordId
      )
    ).toBe(true)
    expect(createTransactionFixture().settlementRecordId).toBe(
      UNSETTLED_SETTLEMENT_RECORD_ID
    )
  })

  it('should create and read a transaction by id', async () => {
    const transaction = createTransactionFixture()

    await expect(repo.create(transaction)).resolves.toEqual(transaction)
    await expect(repo.findById(transaction.id)).resolves.toEqual(transaction)
  })

  it('should update an existing transaction', async () => {
    const transaction = createTransactionFixture()
    await repo.create(transaction)

    const updated = await repo.update(transaction.id, {
      description: 'Updated breakfast',
      tags: ['meal', 'friends'],
      updatedAt: baseTimestamp + 1000,
    })

    expect(updated).toMatchObject({
      id: transaction.id,
      description: 'Updated breakfast',
      tags: ['meal', 'friends'],
      createdAt: baseTimestamp,
      updatedAt: baseTimestamp + 1000,
    })

    await expect(repo.findById(transaction.id)).resolves.toMatchObject({
      description: 'Updated breakfast',
      tags: ['meal', 'friends'],
    })
  })

  it('should reject invalid transaction writes', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)

    try {
      await expect(
        repo.create(
          createTransactionFixture({
            id: 'tx-invalid',
            amount: 0,
          })
        )
      ).rejects.toThrow()
    } finally {
      consoleErrorSpy.mockRestore()
    }
  })

  it('should reject invalid payment methods', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)

    try {
      await expect(
        repo.create(
          createTransactionFixture({
            id: 'tx-invalid-payment',
            paymentMethod: 'Bank Transfer' as Transaction['paymentMethod'],
          })
        )
      ).rejects.toThrow()
    } finally {
      consoleErrorSpy.mockRestore()
    }
  })

  it('should reject income transactions without a recipient', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)

    try {
      await expect(
        repo.create(
          createTransactionFixture({
            id: 'tx-invalid-income-recipient',
            type: 'income',
            categoryId: '101-1',
            receivedByUserId: null,
          })
        )
      ).rejects.toThrow()
    } finally {
      consoleErrorSpy.mockRestore()
    }
  })

  it('should return transactions scoped to the requested account book', async () => {
    const accountBookOneTransactions = [
      createTransactionFixture({ id: 'tx-1', accountBookId: '1' }),
      createTransactionFixture({
        id: 'tx-2',
        accountBookId: '1',
        description: 'Lunch',
        amount: 240,
        paidByDetail: [
          {
            userId: userList[0]!.id,
            userType: 'registered' as const,
            amount: 240,
          },
        ],
        splitDetail: [
          {
            userId: userList[0]!.id,
            userType: 'registered' as const,
            amount: 120,
          },
          {
            userId: userList[1]!.id,
            userType: 'registered' as const,
            amount: 120,
          },
        ],
      }),
    ]
    const accountBookTwoTransaction = createTransactionFixture({
      id: 'tx-3',
      accountBookId: '2',
      description: 'Salary',
      type: 'income',
      categoryId: '101',
      receivedByUserId: userList[0]!.id,
      paidByDetail: [
        {
          userId: userList[0]!.id,
          userType: 'registered' as const,
          amount: 5000,
        },
      ],
      splitDetail: [
        {
          userId: userList[0]!.id,
          userType: 'registered' as const,
          amount: 5000,
        },
      ],
      amount: 5000,
    })

    await repo.create(accountBookOneTransactions[0])
    await repo.create(accountBookOneTransactions[1])
    await repo.create(accountBookTwoTransaction)

    const scopedTransactions = await repo.findByAccountBookId('1')

    expect(scopedTransactions).toHaveLength(2)
    scopedTransactions.forEach((transaction) => {
      expect(transaction.accountBookId).toBe('1')
    })
  })

  it('should return transactions scoped to the requested account book and date', async () => {
    await repo.create(
      createTransactionFixture({ id: 'tx-1', accountBookId: '1', date: '2026/03/18' })
    )
    await repo.create(
      createTransactionFixture({ id: 'tx-2', accountBookId: '1', date: '2026/03/19' })
    )
    await repo.create(
      createTransactionFixture({ id: 'tx-3', accountBookId: '2', date: '2026/03/18' })
    )

    await expect(
      repo.findByDate({ accountBookId: '1', date: '2026/03/18' })
    ).resolves.toEqual([expect.objectContaining({ id: 'tx-1' })])
  })

  it('should return transactions within a date range for an account book', async () => {
    await repo.create(
      createTransactionFixture({ id: 'tx-1', accountBookId: '1', date: '2026/03/18', amount: 120 })
    )
    await repo.create(
      createTransactionFixture({ id: 'tx-2', accountBookId: '1', date: '2026/03/18', amount: 80 })
    )
    await repo.create(
      createTransactionFixture({ id: 'tx-3', accountBookId: '1', date: '2026/03/19', amount: 40 })
    )
    await repo.create(
      createTransactionFixture({ id: 'tx-4', accountBookId: '1', date: '2026/03/20', amount: 50 })
    )

    const results = await repo.findByDateRange({
      accountBookId: '1',
      startDate: '2026/03/18',
      endDate: '2026/03/19',
    })

    expect(results).toHaveLength(3)
    expect(results.map((t) => t.id).sort()).toEqual(['tx-1', 'tx-2', 'tx-3'])
  })

  it('should return an empty array for a date range with no transactions', async () => {
    await repo.create(
      createTransactionFixture({ id: 'tx-1', accountBookId: '1', date: '2026/03/18' })
    )

    const results = await repo.findByDateRange({
      accountBookId: '1',
      startDate: '2026/04/01',
      endDate: '2026/04/30',
    })

    expect(results).toEqual([])
  })

  it('should not return transactions outside the date range', async () => {
    await repo.create(
      createTransactionFixture({ id: 'tx-in', accountBookId: '1', date: '2026/03/15' })
    )
    await repo.create(
      createTransactionFixture({ id: 'tx-before', accountBookId: '1', date: '2026/02/28' })
    )
    await repo.create(
      createTransactionFixture({ id: 'tx-after', accountBookId: '1', date: '2026/04/01' })
    )

    const results = await repo.findByDateRange({
      accountBookId: '1',
      startDate: '2026/03/01',
      endDate: '2026/03/31',
    })

    expect(results).toHaveLength(1)
    expect(results[0].id).toBe('tx-in')
  })

  it('should find transactions by settlement record id via reverse lookup', async () => {
    await repo.create(
      createTransactionFixture({
        id: 'tx-1',
        settlementRecordId: 'record-1',
      })
    )
    await repo.create(
      createTransactionFixture({
        id: 'tx-2',
        settlementRecordId: 'record-1',
        description: 'Dinner',
      })
    )
    await repo.create(
      createTransactionFixture({
        id: 'tx-3',
        settlementRecordId: 'record-2',
        description: 'Taxi',
      })
    )
    await repo.create(
      createTransactionFixture({
        id: 'tx-4',
        settlementRecordId: 'record-1',
        description: 'Deleted dinner',
        deletedAt: baseTimestamp + 1000,
      })
    )

    await expect(repo.findBySettlementRecordId('record-1')).resolves.toEqual([
      expect.objectContaining({ id: 'tx-1' }),
      expect.objectContaining({ id: 'tx-2' }),
    ])
  })

  it('should find unsettled expense transactions by account book id via sentinel index', async () => {
    await repo.create(
      createTransactionFixture({ id: 'tx-sentinel', accountBookId: 'book-1' })
    )
    await repo.create(
      createTransactionFixture({
        id: 'tx-settled',
        accountBookId: 'book-1',
        settlementRecordId: 'record-1',
      })
    )
    await repo.create(
      createTransactionFixture({
        id: 'tx-income',
        accountBookId: 'book-1',
        type: 'income',
        categoryId: '101-1',
        receivedByUserId: userList[0]!.id,
      })
    )
    await repo.create(
      createTransactionFixture({
        id: 'tx-deleted',
        accountBookId: 'book-1',
        deletedAt: baseTimestamp + 1000,
      })
    )
    await repo.create(
      createTransactionFixture({
        id: 'tx-other-book',
        accountBookId: 'book-2',
      })
    )

    await expect(
      repo.findUnsettledExpenseByAccountBookId('book-1')
    ).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'tx-sentinel' })])
    )
  })

  it('should delete a transaction and report false for missing records', async () => {
    const transaction = createTransactionFixture()
    await repo.create(transaction)

    await expect(repo.delete(transaction.id)).resolves.toBe(true)
    await expect(repo.findById(transaction.id)).resolves.toBeNull()
    await expect(repo.delete('missing-transaction')).resolves.toBe(false)
  })

  it('should clear all transactions for development workflows', async () => {
    await repo.create(createTransactionFixture({ id: 'tx-1' }))
    await repo.create(
      createTransactionFixture({ id: 'tx-2', accountBookId: '2' })
    )

    await repo.clear()

    await expect(repo.findAll()).resolves.toEqual([])
  })

  it('should return null when updating a missing transaction', async () => {
    await expect(
      repo.update('missing-transaction', {
        description: 'No-op',
      })
    ).resolves.toBeNull()
  })
})
