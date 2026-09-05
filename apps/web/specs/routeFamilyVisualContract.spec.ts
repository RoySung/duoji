import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

type RouteContract = {
  file: string
  marker: 'EntryShell' | 'PageScaffold' | 'page-scaffold'
}

const routeContracts: RouteContract[] = [
  { file: 'src/pages/account-books/[id]/index.tsx', marker: 'PageScaffold' },
  { file: 'src/pages/account-books/[id]/report.tsx', marker: 'PageScaffold' },
  {
    file: 'src/pages/account-books/[id]/settlement/index.tsx',
    marker: 'PageScaffold',
  },
  {
    file: 'src/pages/account-books/[id]/settlement/[recordId].tsx',
    marker: 'PageScaffold',
  },
  { file: 'src/pages/settings.tsx', marker: 'PageScaffold' },
  { file: 'src/pages/index.tsx', marker: 'PageScaffold' },
  {
    file: 'src/components/accountBookSettings/AccountBookCreatePage.tsx',
    marker: 'PageScaffold',
  },
  {
    file: 'src/components/accountBookSettings/AccountBookEditPage.tsx',
    marker: 'PageScaffold',
  },
  {
    file: 'src/components/categorySettings/CategorySettingsPage.tsx',
    marker: 'page-scaffold',
  },
  { file: 'src/pages/login.tsx', marker: 'EntryShell' },
  { file: 'src/pages/onboarding/index.tsx', marker: 'EntryShell' },
]

function readWebFile(relativePath: string) {
  return readFileSync(resolve(__dirname, '..', relativePath), 'utf8')
}

function flattenMessages(
  value: unknown,
  prefix = '',
  result = new Map<string, string>()
) {
  if (typeof value === 'string') {
    result.set(prefix, value)
    return result
  }

  if (value && typeof value === 'object') {
    for (const [key, nestedValue] of Object.entries(value)) {
      flattenMessages(nestedValue, prefix ? `${prefix}.${key}` : key, result)
    }
  }

  return result
}

describe('route-family visual and localization contract', () => {
  it.each(routeContracts)(
    '$file composes the shared centered entry or page frame',
    ({ file, marker }) => {
      const source = readWebFile(file)

      expect(source).toContain(marker)
      expect(source).not.toMatch(/max-w-4xl|rounded-3xl|bg-orange-400/)
    }
  )

  it('keeps representative English and Traditional Chinese UI messages in parity', () => {
    const english = flattenMessages(
      JSON.parse(readWebFile('src/i18n/messages/en-US.json'))
    )
    const traditionalChinese = flattenMessages(
      JSON.parse(readWebFile('src/i18n/messages/zh-TW.json'))
    )
    const representativeKeys = [
      'common.next',
      'transactions.label',
      'report.label',
      'settlement.label',
      'settings.heading',
      'onboarding.step1.title',
      'emptyState.noAccountBooks.title',
    ]

    for (const key of representativeKeys) {
      expect(english.get(key)).toBeTruthy()
      expect(traditionalChinese.get(key)).toBeTruthy()
      expect(traditionalChinese.get(key)).not.toBe(english.get(key))
    }
  })

  it('keeps focus, overflow, and 24px-minimum target treatments in every family', () => {
    const sources = [
      readWebFile('src/components/layout/navbar.tsx'),
      readWebFile('src/components/calendar/TransactionCalendar.tsx'),
      readWebFile('src/components/TransactionModal/formControlStyles.ts'),
      readWebFile('src/components/report/CategoryTransactionsModal.tsx'),
      readWebFile('src/components/settlement/settlementModalStyles.ts'),
      readWebFile('src/components/accountBookSettings/UserSection.tsx'),
      readWebFile('src/components/onboarding/StepShell.tsx'),
    ]

    for (const source of sources) {
      const targetClasses =
        source.match(/\b(?:min-h|min-w|h|w|size)-(\d+)\b/g) ?? []
      expect(
        targetClasses.some((className) => {
          const tailwindStep = Number(className.match(/\d+$/)?.[0])
          return Number.isFinite(tailwindStep) && tailwindStep >= 6
        })
      ).toBe(true)
      expect(source).toMatch(/focus-visible|group-data-\[focus=true\]/)
    }

    expect(sources.join('\n')).toMatch(/overflow-y-auto/)
    expect(sources.join('\n')).toMatch(/break-words|truncate/)
  })
})
