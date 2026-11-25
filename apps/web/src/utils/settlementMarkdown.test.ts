import {
  generateSettlementDraftMarkdown,
  generateSettlementMarkdown as originalGenerate,
} from './settlementMarkdown'
import { SettlementRecord } from '@/entities/settlement'
import { Transaction } from '@/entities/transaction'
import { User } from '@/entities/user'

const mockT = (key: string, values?: any): string => {
  switch (key) {
    case 'settlement.markdown.draft.title':
      return `# Settlement draft\n\nExported at ${values.timestamp}`
    case 'settlement.markdown.draft.roundingOn':
      return 'Auto-rounding on'
    case 'settlement.markdown.draft.transfers':
      return '## Suggested transfers'
    case 'settlement.markdown.draft.includedExpenses':
      return `Included expenses (${values.count})`
    case 'settlement.sharedWallet.title':
      return 'Shared Wallet Summary'
    case 'settlement.sharedWallet.total':
      return 'Total Expenses'
    case 'settlement.sharedWallet.average':
      return 'Average per Person'
    case 'settlement.sharedWallet.borrowings':
      return 'Extra Borrowings'
    case 'settlement.markdown.content.title':
      return `# Settlement #${values.sequenceNumber}\n\nDate: ${values.date}`
    case 'settlement.markdown.content.autoRoundNote':
      return 'Rounding: Ceil'
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
  it('renders header with sequence number, date, and autoRoundNote when autoRound is true', () => {
    const md = generateSettlementMarkdown({
      sequenceNumber: 7,
      record: baseRecord,
      transactions: [],
      currency: 'TWD',
      autoRound: true,
      userMap,
      categoryMap,
    })
    expect(md).toContain('# Settlement #7')
    expect(md).toMatch(/Date: \d{4}-\d{2}-\d{2}/)
    expect(md).toContain('_Rounding: Ceil_')
  })

  it('omits autoRoundNote when autoRound is false', () => {
    const md = generateSettlementMarkdown({
      sequenceNumber: 7,
      record: baseRecord,
      transactions: [],
      currency: 'TWD',
      autoRound: false,
      userMap,
      categoryMap,
    })
    expect(md).not.toContain('_Rounding: Ceil_')
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

  it('renders member balances with settled / receive / pay states and applies autoRound', () => {
    const record: SettlementRecord = {
      ...baseRecord,
      memberStatuses: [
        { userId: alice.id, paidAmount: 100.2, splitAmount: 50.1, netAmount: 50.1 },
        { userId: bob.id, paidAmount: 0, splitAmount: 50.1, netAmount: -50.1 },
        { userId: deletedCarol.id, paidAmount: 30, splitAmount: 30, netAmount: 0 },
      ],
    }
    const md = generateSettlementMarkdown({
      sequenceNumber: 1,
      record,
      transactions: [],
      currency: 'TWD',
      autoRound: true,
      userMap,
      categoryMap,
    })
    expect(md).toContain('| Alice | 51 TWD | 101 TWD | +51 TWD (to receive) |')
    expect(md).toContain('| Bob | 51 TWD | 0 TWD | -51 TWD (to pay) |')
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

  it('formats suggested transfer amounts with ceil rounding when autoRound is true', () => {
    const record: SettlementRecord = {
      ...baseRecord,
      transfers: [
        {
          id: 't-1',
          fromUserId: bob.id,
          toUserId: alice.id,
          suggestedAmount: 150.2,
          actualAmount: null,
          note: '',
          status: 'pending',
          completedAt: null,
        },
      ],
    }
    const mdAutoRound = generateSettlementMarkdown({
      sequenceNumber: 1,
      record,
      transactions: [],
      currency: 'TWD',
      autoRound: true,
      userMap,
      categoryMap,
    })
    expect(mdAutoRound).toContain('- [ ] Bob → Alice: 151 TWD')

    const mdNoRound = generateSettlementMarkdown({
      sequenceNumber: 1,
      record,
      transactions: [],
      currency: 'TWD',
      autoRound: false,
      userMap,
      categoryMap,
    })
    expect(mdNoRound).toContain('- [ ] Bob → Alice: 150.2 TWD')
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

describe('generateSettlementDraftMarkdown', () => {
  it('escapes custom currency delimiters throughout the draft', () => {
    const draft = generateSettlementDraftMarkdown({
      exportedAt: new Date('2026-11-25T02:00:00.000Z'),
      memberStatuses: [
        { userId: alice.id, splitAmount: 50, paidAmount: 100, netAmount: 50 },
      ],
      transfers: [{ fromUserId: bob.id, toUserId: alice.id, suggestedAmount: 50 }],
      sharedWalletSummary: {
        totalExpense: 20,
        averagePerPerson: 10,
        borrowings: [{ userId: bob.id, amount: 5 }],
      },
      transactions: [baseTransaction],
      currency: 'A|B',
      userMap,
      categoryMap,
      t: mockT,
    })

    expect(draft).toContain(
      '| Alice | 50 A\\|B | 100 A\\|B | +50 A\\|B (to receive) |'
    )
    expect(draft).toContain('- Bob → Alice: 50 A\\|B')
    expect(draft).toContain('- Total Expenses: 20 A\\|B')
    expect(draft).toContain('Paid by: Alice 100 A\\|B')
    expect(draft).not.toContain('A|B')
  })

  it.each([
    ['# Alex', '\\# Alex'],
    ['- Alex', '\\- Alex'],
    ['+ Alex', '\\+ Alex'],
    ['1. Alex', '1\\. Alex'],
    ['1) Alex', '1\\) Alex'],
  ])('keeps %s literal at the start of a draft list item', (name, escaped) => {
    const draft = generateSettlementDraftMarkdown({
      exportedAt: new Date('2026-11-25T02:00:00.000Z'),
      memberStatuses: [],
      transfers: [{ fromUserId: alice.id, toUserId: bob.id, suggestedAmount: 60 }],
      sharedWalletSummary: {
        totalExpense: 60,
        averagePerPerson: 0,
        borrowings: [{ userId: alice.id, amount: 60 }],
      },
      transactions: [],
      currency: 'TWD',
      userMap: new Map([[alice.id, { ...alice, name }], [bob.id, bob]]),
      categoryMap: new Map(),
      t: mockT,
    })

    expect(draft).toContain(`- ${escaped} → Bob: 60 TWD`)
    expect(draft).toContain(`  - ${escaped}: -60 TWD`)
  })

  it('keeps a draft shareable with wallet values and escaped user-entered text', () => {
    const participant = { ...alice, name: '艾莉|絲\n[旅行]' }
    const draft = generateSettlementDraftMarkdown({
      exportedAt: new Date('2026-11-25T02:00:00.000Z'),
      memberStatuses: [
        {
          userId: participant.id,
          paidAmount: 10,
          splitAmount: 5.25,
          netAmount: 4.75,
        },
      ],
      transfers: [
        { fromUserId: bob.id, toUserId: participant.id, suggestedAmount: 4.75 },
      ],
      sharedWalletSummary: {
        totalExpense: 11.2,
        averagePerPerson: 2.45,
        borrowings: [{ userId: bob.id, amount: 5.25 }],
      },
      transactions: [{ ...baseTransaction, description: '京都|晚餐\n<包廂>' }],
      currency: 'TWD',
      autoRound: true,
      userMap: new Map([
        [participant.id, participant],
        [bob.id, bob],
      ]),
      categoryMap: new Map([['cat-1', '用餐|聚會']]),
      t: mockT,
    })

    expect(draft).toContain('Exported at 2026-11-25T02:00:00.000Z')
    expect(draft).toContain('| 艾莉\\|絲 \\[旅行\\] |')
    expect(draft).toContain('- Bob → 艾莉\\|絲 \\[旅行\\]: 5 TWD')
    expect(draft).not.toContain('[ ]')
    expect(draft).toContain('京都\\|晚餐 \\<包廂\\>')
    expect(draft).toContain('Category: 用餐\\|聚會')
    expect(draft).toContain('## Shared Wallet Summary')
    expect(draft).toContain('Total Expenses: 11.2 TWD')
    expect(draft).toContain('Average per Person: 3 TWD')
    expect(draft).toContain('Bob: -6 TWD')
  })
})
