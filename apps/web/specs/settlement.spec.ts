import {
  Transaction,
  UNSETTLED_SETTLEMENT_RECORD_ID,
} from '../src/entities/transaction'
import { SettlementRecord } from '../src/entities/settlement'
import { db } from '../src/lib/dexie'
import { userList } from '../src/mocks/user'
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
})
