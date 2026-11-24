import {
  Transaction,
  UNSETTLED_SETTLEMENT_RECORD_ID,
} from '../src/entities/transaction'
import { SettlementRecord } from '../src/entities/settlement'
import { db } from '../src/lib/dexie'
import { userList } from './fixtures'
import SettlementLocalRepo from '../src/repositories/settlementRepo/settlementLocalRepo'
import TransactionLocalRepo from '../src/repositories/transactionRepo/transactionLocalRepo'

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

function createSettlementRecordFixture(
  overrides: Partial<SettlementRecord> = {}
): SettlementRecord {
  return {
    id: 'record-1',
    accountBookId: 'book-1',
    memberStatuses: [
      {
        userId: userList[0]!.id,
        paidAmount: 120,
        splitAmount: 60,
        netAmount: 60,
      },
      {
        userId: userList[1]!.id,
        paidAmount: 0,
        splitAmount: 60,
        netAmount: -60,
      },
    ],
    transfers: [
      {
        id: 'transfer-1',
        fromUserId: userList[1]!.id,
        toUserId: userList[0]!.id,
        suggestedAmount: 60,
        actualAmount: null,
        note: '',
        status: 'pending',
        completedAt: null,
      },
    ],
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
    ...overrides,
  }
}

describe('Settlement repositories', () => {
  let settlementRepo: SettlementLocalRepo
  let transactionRepo: TransactionLocalRepo

  beforeEach(async () => {
    await db.delete()
    await db.open()
    settlementRepo = new SettlementLocalRepo()
    transactionRepo = new TransactionLocalRepo()
  })

  afterAll(async () => {
    await db.delete()
  })

  it('sets settlementRecordId on included transactions when creating a settlement record', async () => {
    await transactionRepo.create(createTransactionFixture({ id: 'tx-1' }))
    await transactionRepo.create(createTransactionFixture({ id: 'tx-2' }))

    const record = createSettlementRecordFixture()

    await settlementRepo.create(record, ['tx-1', 'tx-2'])

    await expect(transactionRepo.findById('tx-1')).resolves.toMatchObject({
      settlementRecordId: record.id,
    })
    await expect(transactionRepo.findById('tx-2')).resolves.toMatchObject({
      settlementRecordId: record.id,
    })
  })

  it('rolls back settlement creation if linking its expenses fails', async () => {
    const record = createSettlementRecordFixture()
    const expense = await transactionRepo.create(createTransactionFixture())
    const rejectLink = () => {
      throw new Error('Failed to link expense')
    }

    db.transactions.hook('updating', rejectLink)
    try {
      await expect(settlementRepo.create(record, [expense.id])).rejects.toThrow(
        'Failed to link expense'
      )
    } finally {
      db.transactions.hook('updating').unsubscribe(rejectLink)
    }

    await expect(settlementRepo.findById(record.id)).resolves.toBeNull()
    await expect(transactionRepo.findById(expense.id)).resolves.toEqual(expense)
  })

  it('retrieves settlement history transactions via reverse lookup on settlementRecordId', async () => {
    const record = createSettlementRecordFixture()

    await transactionRepo.create(
      createTransactionFixture({ id: 'tx-1', settlementRecordId: record.id })
    )
    await transactionRepo.create(
      createTransactionFixture({
        id: 'tx-2',
        settlementRecordId: record.id,
        description: 'Dinner',
      })
    )
    await transactionRepo.create(
      createTransactionFixture({
        id: 'tx-3',
        settlementRecordId: 'record-2',
        description: 'Taxi',
      })
    )

    await settlementRepo.create(record)

    await expect(
      transactionRepo.findBySettlementRecordId(record.id)
    ).resolves.toEqual([
      expect.objectContaining({ id: 'tx-1' }),
      expect.objectContaining({ id: 'tx-2' }),
    ])
  })

  it('hides canceled records and reopens only their own expenses for a new settlement', async () => {
    const record = createSettlementRecordFixture()
    const expense = createTransactionFixture()
    const deleted = createTransactionFixture({
      id: 'deleted',
      settlementRecordId: record.id,
      deletedAt: baseTimestamp,
    })
    const otherBook = createTransactionFixture({
      id: 'other-book',
      accountBookId: 'book-2',
      settlementRecordId: record.id,
    })
    await db.transactions.bulkAdd([expense, deleted, otherBook])
    await settlementRepo.create(record, [expense.id])

    await expect(settlementRepo.cancel('book-2', record.id)).rejects.toThrow()
    await settlementRepo.cancel(record.accountBookId, record.id)
    await expect(
      settlementRepo.cancel(record.accountBookId, record.id)
    ).rejects.toThrow()

    await expect(settlementRepo.findById(record.id)).resolves.toBeNull()
    await expect(
      settlementRepo.findByAccountBookId(record.accountBookId)
    ).resolves.toEqual([])
    await expect(db.settlements.get(record.id)).resolves.toMatchObject({
      ...record,
      deletedAt: expect.any(Number),
      updatedAt: expect.any(Number),
    })
    await expect(db.transactions.get(deleted.id)).resolves.toEqual({
      ...deleted,
      settlementRecordId: UNSETTLED_SETTLEMENT_RECORD_ID,
    })
    await expect(db.transactions.get(otherBook.id)).resolves.toEqual(otherBook)
    await expect(
      transactionRepo.findUnsettledExpenseByAccountBookId(record.accountBookId)
    ).resolves.toEqual([expense])

    await settlementRepo.create({ ...record, id: 'record-2' }, [expense.id])
    await expect(
      transactionRepo.findBySettlementRecordId('record-2')
    ).resolves.toEqual([{ ...expense, settlementRecordId: 'record-2' }])
  })

  it('serializes transfer completion with cancellation in either order', async () => {
    const record = createSettlementRecordFixture()
    const completedTransfer = {
      ...record.transfers[0]!,
      id: 'shared-wallet-transfer',
      toUserId: 'shared-wallet',
      status: 'completed' as const,
      actualAmount: 60,
      completedAt: baseTimestamp,
    }
    const transfers = [...record.transfers, completedTransfer]
    await settlementRepo.create(record)

    const [updated, rejected] = await Promise.allSettled([
      settlementRepo.update(record.id, { transfers }),
      settlementRepo.cancel(record.accountBookId, record.id),
    ])
    expect(updated.status).toBe('fulfilled')
    expect(rejected.status).toBe('rejected')
    await expect(settlementRepo.findById(record.id)).resolves.toMatchObject({
      transfers,
    })

    const anotherRecord = { ...record, id: 'record-2', transfers: [] }
    await settlementRepo.create(anotherRecord)
    const [, staleUpdate] = await Promise.all([
      settlementRepo.cancel(anotherRecord.accountBookId, anotherRecord.id),
      settlementRepo.update(anotherRecord.id, { updatedAt: baseTimestamp + 1 }),
    ])
    expect(staleUpdate).toBeNull()
    await expect(settlementRepo.findById(anotherRecord.id)).resolves.toBeNull()
  })

  it('rolls back record cancellation if reopening expenses fails', async () => {
    const record = createSettlementRecordFixture()
    const expense = createTransactionFixture({ settlementRecordId: record.id })
    await settlementRepo.create(record)
    await transactionRepo.create(expense)

    const rejectUpdate = () => {
      throw new Error('Failed to reopen expense')
    }
    db.transactions.hook('updating', rejectUpdate)
    try {
      await expect(
        settlementRepo.cancel(record.accountBookId, record.id)
      ).rejects.toThrow('Failed to reopen expense')
    } finally {
      db.transactions.hook('updating').unsubscribe(rejectUpdate)
    }

    await expect(settlementRepo.findById(record.id)).resolves.toEqual(record)
    await expect(transactionRepo.findById(expense.id)).resolves.toEqual(expense)
  })

  it('keeps a reopened expense unsettled when saving an older edit', async () => {
    const record = createSettlementRecordFixture()
    const draft = createTransactionFixture({ settlementRecordId: record.id })
    await settlementRepo.create(record)
    await transactionRepo.create(draft)

    await Promise.all([
      settlementRepo.cancel(record.accountBookId, record.id),
      transactionRepo.update(draft.id, { ...draft, description: 'Updated' }),
    ])

    await expect(transactionRepo.findById(draft.id)).resolves.toMatchObject({
      description: 'Updated',
      settlementRecordId: UNSETTLED_SETTLEMENT_RECORD_ID,
    })
  })
})
