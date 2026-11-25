import { layoutSettlementImage } from './settlementImageLayout'

import type { SettlementRecord } from '@/entities/settlement'
import type { Transaction } from '@/entities/transaction'
import { createSettlementImageReport } from './settlementImageReport'

const record: SettlementRecord = {
  id: 'record',
  accountBookId: 'book',
  createdAt: 0,
  updatedAt: 0,
  memberStatuses: [
    { userId: 'A', splitAmount: 150.2, paidAmount: 300.4, netAmount: 150.2 },
  ],
  transfers: [
    {
      id: 'transfer',
      fromUserId: 'B',
      toUserId: 'A',
      suggestedAmount: 150.2,
      actualAmount: 150.25,
      completedAt: 1,
      status: 'completed',
      note: 'Bank transfer',
    },
  ],
}

const expense: Transaction = {
  id: 'expense',
  accountBookId: 'book',
  type: 'expense',
  categoryId: 'food',
  amount: 300.4,
  date: '2026/11/24',
  description: 'Dinner',
  paymentMethod: 'Cash',
  receivedByUserId: null,
  tags: [],
  paidByDetail: [{ userId: 'A', amount: 300.4 }],
  splitDetail: [{ userId: 'B', amount: 150.2 }],
  settlementRecordId: 'record',
  createdAt: 0,
  updatedAt: 0,
  deletedAt: null,
}

it.each([
  [true, '151 TWD'],
  [false, '150.2 TWD'],
])(
  'formats suggested amounts with automatic rounding set to %s',
  (autoRound, suggested) => {
    const report = createSettlementImageReport({
      sequenceNumber: 12,
      record,
      transactions: [expense, { ...expense, id: 'deleted', deletedAt: 1 }],
      currency: 'TWD',
      autoRound,
      userMap: new Map(),
      categoryMap: new Map([['food', 'Food']]),
      t: (key) => key,
    })

    expect(report.members[0].balance).toBe(suggested)
    expect(report.transfers).toEqual([
      {
        direction: 'B → A',
        suggested,
        completed: true,
        actual: '150.25 TWD',
        note: 'Bank transfer',
      },
    ])
    expect(report.expenses).toEqual([
      {
        description: 'Dinner',
        date: '2026/11/24',
        category: 'Food',
        amount: '300.4 TWD',
        payers: ['A 300.4 TWD'],
        splits: ['B 150.2 TWD'],
      },
    ])
  }
)

it('uses the reviewed draft inputs and includes applicable Shared Wallet amounts', () => {
  const report = createSettlementImageReport({
    exportedAt: new Date(2026, 10, 25, 12, 30),
    memberStatuses: [
      ...record.memberStatuses,
      { userId: 'C', splitAmount: 0, paidAmount: 0, netAmount: 0 },
    ],
    transfers: record.transfers,
    sharedWalletSummary: {
      totalExpense: 300.4,
      averagePerPerson: 150.2,
      borrowings: [{ userId: 'B', amount: 10.2 }],
    },
    transactions: [expense],
    currency: 'TWD',
    autoRound: true,
    userMap: new Map(),
    categoryMap: new Map(),
    t: (key) => key,
  })

  expect(report.title).toBe('settlement.image.draftTitle')
  expect(report.date).toBe('2026-11-25 12:30')
  expect(report.completed).toBeNull()
  expect(report.members[0].balance).toBe('151 TWD')
  expect(report.transfers).toEqual([
    {
      direction: 'B → A',
      suggested: '151 TWD',
      completed: null,
      actual: null,
      note: '',
    },
  ])
  expect(report.wallet).toEqual({
    total: '300.4 TWD',
    average: '151 TWD',
    borrowings: [{ name: 'B', amount: '11 TWD' }],
  })
  expect(report.expenses[0].amount).toBe('300.4 TWD')

  const canvas = {
    measureText: (value: string) => ({ width: value.length * 1.5 }),
  }
  const sections = layoutSettlementImage(
    report,
    canvas as CanvasRenderingContext2D,
    'sans-serif'
  )
  const renderedText = sections
    .flatMap(({ heading, rows }) => [
      ...(heading?.text ?? []),
      ...rows.flatMap(({ lines }) => lines.flatMap(({ text }) => text)),
    ])
    .map(({ value }) => value)
  expect(renderedText).toEqual(
    expect.arrayContaining([
      'settlement.image.draftTitle',
      'settlement.confirm.transfers',
      'settlement.sharedWallet.title',
      'settlement.sharedWallet.borrowings',
      'settlement.markdown.content.tableHeaderBalance',
      '−11 TWD',
      'Dinner',
    ])
  )
  expect(renderedText).not.toContain('settlement.detail.pending')
  expect(renderedText).not.toContain('settlement.detail.done')
  expect(renderedText).not.toContain('settlement.detail.settled')
})
