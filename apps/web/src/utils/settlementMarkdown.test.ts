import { generateSettlementMarkdown as originalGenerate } from './settlementMarkdown'
import { SettlementRecord } from '@/entities/settlement'
import { Transaction } from '@/entities/transaction'
import { User } from '@/entities/user'

const mockT = (key: string, values?: any): string => {
  switch (key) {
    case 'settlement.markdown.content.title':
      return `# Settlement #${values.sequenceNumber}\n\nDate: ${values.date}`
    case 'settlement.markdown.content.deleted':
      return '(deleted)'
    case 'settlement.markdown.content.memberBalances':
      return '## Member Balances'
    case 'settlement.markdown.content.noMemberData':
      return '_No member data._'
    case 'settlement.markdown.content.tableHeaderMember':
      return 'Member'
    case 'settlement.markdown.content.tableHeaderSplit':
      return 'Split'
    case 'settlement.markdown.content.tableHeaderPaid':
      return 'Paid'
    case 'settlement.markdown.content.tableHeaderBalance':
      return 'Balance'
    case 'settlement.markdown.content.settled':
      return '(settled)'
    case 'settlement.markdown.content.toReceive':
      return '(to receive)'
    case 'settlement.markdown.content.toPay':
      return '(to pay)'
    case 'settlement.markdown.content.transfers':
      return '## Transfers'
    case 'settlement.markdown.content.noTransfers':
      return '_No transfers._'
    case 'settlement.markdown.content.actual':
      return `(actual: ${values.amount}${values.note})`
    case 'settlement.markdown.content.coveredTransactions':
      return `## Covered Transactions (${values.count})`
    case 'settlement.markdown.content.noCoveredTransactions':
      return '_No covered transactions._'
    case 'settlement.markdown.content.noDescription':
      return 'No description'
    case 'settlement.markdown.content.category':
      return `Category: ${values.category}`
    case 'settlement.markdown.content.paidBy':
      return `Paid by: ${values.paidBy}`
    case 'settlement.markdown.content.splitWith':
      return `Split with: ${values.splitWith}`
    default:
      return key
  }
}

const generateSettlementMarkdown = (params: Omit<Parameters<typeof originalGenerate>[0], 't'>) =>
  originalGenerate({ ...params, t: mockT })


const alice: User = {
  type: 'registered',
  id: 'u-alice',
  name: 'Alice',
  email: 'alice@example.com',
  avatarUrl: 'https://example.com/a.png',
  createdAt: 0,
  updatedAt: 0,
}

const bob: User = {
  type: 'registered',
  id: 'u-bob',
  name: 'Bob',
  email: 'bob@example.com',
  avatarUrl: 'https://example.com/b.png',
  createdAt: 0,
  updatedAt: 0,
}

const deletedCarol: User = {
  type: 'virtual',
  id: 'u-carol',
  name: 'Carol',
  accountBookId: 'ab-1',
  createdAt: 0,
  updatedAt: 0,
  deletedAt: 1234,
}

const userMap = new Map<string, User>([
  [alice.id, alice],
  [bob.id, bob],
  [deletedCarol.id, deletedCarol],
])

const categoryMap = new Map<string, string>([['cat-1', 'Food']])

const baseRecord: SettlementRecord = {
  id: 's-1',
  accountBookId: 'ab-1',
  memberStatuses: [],
  transfers: [],
  createdAt: Date.parse('2024-03-15T10:00:00Z'),
  updatedAt: Date.parse('2024-03-15T10:00:00Z'),
}

const baseTransaction: Transaction = {
  id: 'tx-1',
  type: 'expense',
  accountBookId: 'ab-1',
  categoryId: 'cat-1',
  amount: 100,
  date: '2024/03/15',
  description: 'Lunch',
  paymentMethod: 'Cash',
  receivedByUserId: null,
  tags: [],
  paidByDetail: [{ userId: alice.id, amount: 100 }],
  splitDetail: [
    { userId: alice.id, amount: 50 },
    { userId: bob.id, amount: 50 },
  ],
  settlementRecordId: 's-1',
  createdAt: 0,
  updatedAt: 0,
  deletedAt: null,
}

describe('generateSettlementMarkdown', () => {
  it('renders header with sequence number and formatted date', () => {
    const md = generateSettlementMarkdown({
      sequenceNumber: 7,
      record: baseRecord,
      transactions: [],
      currency: 'TWD',
      userMap,
      categoryMap,
    })
    expect(md).toContain('# Settlement #7')
    expect(md).toMatch(/Date: \d{4}-\d{2}-\d{2}/)
  })

  it('shows placeholder when there are no member statuses', () => {
    const md = generateSettlementMarkdown({
      sequenceNumber: 1,
      record: baseRecord,
      transactions: [],
      currency: 'TWD',
      userMap,
      categoryMap,
    })
    expect(md).toContain('## Member Balances')
    expect(md).toContain('_No member data._')
  })

  it('renders member balances with settled / receive / pay states', () => {
    const record: SettlementRecord = {
      ...baseRecord,
      memberStatuses: [
        { userId: alice.id, paidAmount: 100, splitAmount: 50, netAmount: 50 },
        { userId: bob.id, paidAmount: 0, splitAmount: 50, netAmount: -50 },
        { userId: deletedCarol.id, paidAmount: 30, splitAmount: 30, netAmount: 0 },
      ],
    }
    const md = generateSettlementMarkdown({
      sequenceNumber: 1,
      record,
      transactions: [],
      currency: 'TWD',
      userMap,
      categoryMap,
    })
    expect(md).toContain('| Alice | 50 TWD | 100 TWD | +50 TWD (to receive) |')
    expect(md).toContain('| Bob | 50 TWD | 0 TWD | -50 TWD (to pay) |')
    expect(md).toContain('| Carol (deleted) | 30 TWD | 30 TWD | 0 TWD (settled) |')
  })

  it('omits currency suffix when currency is null', () => {
    const record: SettlementRecord = {
      ...baseRecord,
      memberStatuses: [
        { userId: alice.id, paidAmount: 100, splitAmount: 50, netAmount: 50 },
      ],
    }
    const md = generateSettlementMarkdown({
      sequenceNumber: 1,
      record,
      transactions: [],
      currency: null,
      userMap,
      categoryMap,
    })
    expect(md).toContain('| Alice | 50 | 100 | +50 (to receive) |')
  })

  it('falls back to userId when user not in map', () => {
    const record: SettlementRecord = {
      ...baseRecord,
      memberStatuses: [
        { userId: 'u-unknown', paidAmount: 0, splitAmount: 0, netAmount: 0 },
      ],
    }
    const md = generateSettlementMarkdown({
      sequenceNumber: 1,
      record,
      transactions: [],
      currency: 'TWD',
      userMap,
      categoryMap,
    })
    expect(md).toContain('| u-unknown |')
  })

  it('shows placeholder when there are no transfers', () => {
    const md = generateSettlementMarkdown({
      sequenceNumber: 1,
      record: baseRecord,
      transactions: [],
      currency: 'TWD',
      userMap,
      categoryMap,
    })
    expect(md).toContain('## Transfers')
    expect(md).toContain('_No transfers._')
  })

  it('renders pending transfer with unchecked checkbox', () => {
    const record: SettlementRecord = {
      ...baseRecord,
      transfers: [
        {
          id: 't-1',
          fromUserId: bob.id,
          toUserId: alice.id,
          suggestedAmount: 50,
          actualAmount: null,
          note: '',
          status: 'pending',
          completedAt: null,
        },
      ],
    }
    const md = generateSettlementMarkdown({
      sequenceNumber: 1,
      record,
      transactions: [],
      currency: 'TWD',
      userMap,
      categoryMap,
    })
    expect(md).toContain('- [ ] Bob → Alice: 50 TWD')
  })

  it('renders completed transfer without actual when amount matches and no note', () => {
    const record: SettlementRecord = {
      ...baseRecord,
      transfers: [
        {
          id: 't-1',
          fromUserId: bob.id,
          toUserId: alice.id,
          suggestedAmount: 50,
          actualAmount: 50,
          note: '',
          status: 'completed',
          completedAt: 1,
        },
      ],
    }
    const md = generateSettlementMarkdown({
      sequenceNumber: 1,
      record,
      transactions: [],
      currency: 'TWD',
      userMap,
      categoryMap,
    })
    expect(md).toContain('- [x] Bob → Alice: 50 TWD')
    expect(md).not.toContain('actual:')
  })

  it('renders actual amount and note when actual differs or note present', () => {
    const record: SettlementRecord = {
      ...baseRecord,
      transfers: [
        {
          id: 't-1',
          fromUserId: bob.id,
          toUserId: alice.id,
          suggestedAmount: 50,
          actualAmount: 45,
          note: 'rounded down',
          status: 'completed',
          completedAt: 1,
        },
        {
          id: 't-2',
          fromUserId: alice.id,
          toUserId: bob.id,
          suggestedAmount: 20,
          actualAmount: 20,
          note: 'cash',
          status: 'completed',
          completedAt: 1,
        },
      ],
    }
    const md = generateSettlementMarkdown({
      sequenceNumber: 1,
      record,
      transactions: [],
      currency: 'TWD',
      userMap,
      categoryMap,
    })
    expect(md).toContain(
      '- [x] Bob → Alice: 50 TWD _(actual: 45 TWD · rounded down)_'
    )
    expect(md).toContain('- [x] Alice → Bob: 20 TWD _(actual: 20 TWD · cash)_')
  })

  it('renders covered transactions with category, paid by, and split with', () => {
    const md = generateSettlementMarkdown({
      sequenceNumber: 1,
      record: baseRecord,
      transactions: [baseTransaction],
      currency: 'TWD',
      userMap,
      categoryMap,
    })
    expect(md).toContain('## Covered Transactions (1)')
    expect(md).toContain('- 2024/03/15 · Lunch · 100 TWD')
    expect(md).toContain('  - Category: Food')
    expect(md).toContain('  - Paid by: Alice 100 TWD')
    expect(md).toContain('  - Split with: Alice 50 TWD, Bob 50 TWD')
  })

  it('falls back to "No description" and raw categoryId when missing', () => {
    const tx: Transaction = {
      ...baseTransaction,
      description: '',
      categoryId: 'cat-unknown',
    }
    const md = generateSettlementMarkdown({
      sequenceNumber: 1,
      record: baseRecord,
      transactions: [tx],
      currency: 'TWD',
      userMap,
      categoryMap,
    })
    expect(md).toContain('· No description ·')
    expect(md).toContain('  - Category: cat-unknown')
  })

  it('excludes soft-deleted transactions from the count and list', () => {
    const deletedTx: Transaction = { ...baseTransaction, id: 'tx-2', deletedAt: 1 }
    const md = generateSettlementMarkdown({
      sequenceNumber: 1,
      record: baseRecord,
      transactions: [baseTransaction, deletedTx],
      currency: 'TWD',
      userMap,
      categoryMap,
    })
    expect(md).toContain('## Covered Transactions (1)')
  })

  it('shows placeholder when no active covered transactions', () => {
    const md = generateSettlementMarkdown({
      sequenceNumber: 1,
      record: baseRecord,
      transactions: [],
      currency: 'TWD',
      userMap,
      categoryMap,
    })
    expect(md).toContain('## Covered Transactions (0)')
    expect(md).toContain('_No covered transactions._')
  })
})
