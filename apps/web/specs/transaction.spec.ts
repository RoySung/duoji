import {
  DefaultPaymentMethod,
  Transaction,
  TransactionSchema,
} from '../src/entities/transaction'
import { db } from '../src/lib/dexie'
import { userList } from '../src/mocks/user'
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
    tags: ['meal'],
    paidByDetail: [
      {
        user: userList[0],
        amount: 120,
      },
    ],
    splitDetail: [
      {
        user: userList[0],
        amount: 60,
      },
      {
        user: userList[1],
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
        paidByDetail: [{ user: userList[0], amount: 240 }],
        splitDetail: [
          { user: userList[0], amount: 120 },
          { user: userList[1], amount: 120 },
        ],
      }),
    ]
    const accountBookTwoTransaction = createTransactionFixture({
      id: 'tx-3',
      accountBookId: '2',
      description: 'Salary',
      type: 'income',
      categoryId: '101',
      receivedByUserId: userList[0].id,
      paidByDetail: [{ user: userList[0], amount: 5000 }],
      splitDetail: [{ user: userList[0], amount: 5000 }],
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
