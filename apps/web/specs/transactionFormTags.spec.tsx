import React, { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import ExpenseForm from '../src/components/TransactionModal/ExpenseForm'
import IncomeForm from '../src/components/TransactionModal/IncomeForm'
import TagInput from '../src/components/ui/TagInput'
import {
  DefaultPaymentMethod,
  Transaction,
  UNSETTLED_SETTLEMENT_RECORD_ID,
} from '../src/entities/transaction'
import { userList } from './fixtures'

type MockSuggestionState = {
  suggestions: string[]
}

const mockUseAccountBookTagSuggestions = jest.fn()

const mockAccountBooks = [
  {
    id: 'book-1',
    name: 'Household',
  },
  {
    id: 'book-2',
    name: 'Travel',
  },
]

const mockAccountBookStoreState = {
  currentAccountBookId: 'book-1',
  accountBooks: mockAccountBooks,
}

const mockCategoryStoreState = {
  expenseCategories: [
    {
      id: 'expense-cat',
      name: 'Dining',
    },
  ],
  incomeCategories: [
    {
      id: 'income-cat',
      name: 'Salary',
    },
  ],
}

const mockUserStoreState = {
  allUsers: userList,
  activeUsers: userList,
}

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('@heroui/react', () => {
  const React = jest.requireActual('react')

  function getOptionElements(children: any, items?: any[]) {
    const renderedChildren =
      typeof children === 'function' && items
        ? items.map((item) => children(item))
        : React.Children.toArray(children)

    return React.Children.toArray(renderedChildren)
      .filter(React.isValidElement)
      .map((child: any) => {
        const optionValue = String(child.key ?? '').replace(/^[.$]+/, '')

        return (
          <option key={optionValue} value={optionValue}>
            {child.props.children}
          </option>
        )
      })
  }

  return {
    addToast: jest.fn(),
    Avatar: ({ name }: { name: string }) => <div>{name}</div>,
    Button: ({ children, onClick, onPress, ...props }: any) => (
      <button
        type="button"
        onClick={(event) => {
          onPress?.(event)
          onClick?.(event)
        }}
      >
        {children}
      </button>
    ),
    Chip: ({ children, className, onClick, onClose }: any) => {
      if (typeof onClick === 'function') {
        return (
          <button type="button" className={className} onClick={onClick}>
            {children}
          </button>
        )
      }

      return (
        <div className={className}>
          <span>{children}</span>
          {typeof onClose === 'function' ? (
            <button type="button" aria-label={`remove-${children}`} onClick={onClose}>
              remove
            </button>
          ) : null}
        </div>
      )
    },
    DatePicker: ({ label }: { label: string }) => (
      <label>
        <span>{label}</span>
        <input aria-label={label} readOnly value="2026/03/18" />
      </label>
    ),
    Form: ({ children }: { children: React.ReactNode }) => <form>{children}</form>,
    Input: ({
      classNames,
      isClearable,
      isInvalid,
      isRequired,
      label,
      onClear,
      onChange,
      onKeyDown,
      placeholder,
      startContent,
      value,
      ...props
    }: any) => (
      <label>
        <span>{label}</span>
        <input
          aria-label={label}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          value={value ?? ''}
          {...props}
        />
      </label>
    ),
    Select: ({
      children,
      isDisabled,
      items,
      label,
      onSelectionChange,
      selectedKeys,
      selectionMode,
    }: any) => {
      const isMultiple = selectionMode === 'multiple'
      const selectedValues = Array.from(selectedKeys ?? [], String)

      return (
        <label>
          <span>{label}</span>
          <select
            aria-label={label}
            disabled={isDisabled}
            multiple={isMultiple}
            onChange={(event) => {
              const nextValues = isMultiple
                ? Array.from(event.currentTarget.selectedOptions, (option) => option.value)
                : [event.currentTarget.value]
              onSelectionChange?.(new Set(nextValues.filter(Boolean)))
            }}
            value={isMultiple ? selectedValues : selectedValues[0] ?? ''}
          >
            <option value="">Select</option>
            {getOptionElements(children, items)}
          </select>
        </label>
      )
    },
    SelectItem: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }
})

jest.mock('../src/components/TransactionModal/CategorySelector', () => ({
  __esModule: true,
  default: function MockCategorySelector() {
    return <div data-testid="category-selector" />
  },
}))

jest.mock('../src/components/TransactionModal/PaidByDetailModal', () => ({
  __esModule: true,
  default: function MockPaidByDetailModal() {
    return null
  },
}))

jest.mock('../src/components/TransactionModal/SplitDetailModal', () => ({
  __esModule: true,
  default: function MockSplitDetailModal() {
    return null
  },
}))

jest.mock('react-icons/pi', () => ({
  PiGitBranchBold: () => <span>branch</span>,
}))

jest.mock('../src/hooks/useAccountBookTagSuggestions', () => ({
  useAccountBookTagSuggestions: (...args: any[]) =>
    mockUseAccountBookTagSuggestions(...args),
}))

jest.mock('../src/stores/accountBook', () => ({
  useAccountBookStore: (selector: any) => selector(mockAccountBookStoreState),
}))

jest.mock('../src/stores/accountBook/index', () => ({
  useAccountBookStore: (selector: any) => selector(mockAccountBookStoreState),
}))

jest.mock('../src/stores/category', () => ({
  useCategoryStore: (selector: any) => selector(mockCategoryStoreState),
}))

jest.mock('../src/stores/user', () => ({
  useUserStore: (selector: any) => selector(mockUserStoreState),
}))

function createTransactionFixture(
  overrides: Partial<Transaction> = {}
): Transaction {
  const type = overrides.type ?? 'expense'

  return {
    id: 'tx-1',
    type,
    accountBookId: 'book-1',
    categoryId: type === 'income' ? 'income-cat' : 'expense-cat',
    amount: 120,
    date: '2026/03/18',
    description: '',
    paymentMethod: DefaultPaymentMethod,
    receivedByUserId: type === 'income' ? userList[0]!.id : null,
    settlementRecordId: UNSETTLED_SETTLEMENT_RECORD_ID,
    tags: [],
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
        amount: 120,
      },
    ],
    createdAt: 1710000000000,
    updatedAt: 1710000000000,
    deletedAt: null,
    ...overrides,
  }
}

function setMockSuggestionsByBook(
  suggestionsByBook: Record<string, MockSuggestionState>
) {
  mockUseAccountBookTagSuggestions.mockImplementation(
    (accountBookId: string | null) => {
      const state = suggestionsByBook[accountBookId ?? '__none__']

      return {
        suggestions: state?.suggestions ?? [],
      }
    }
  )
}

function ExpenseFormHarness({
  initialValue = createTransactionFixture(),
  isEditMode = false,
}: {
  initialValue?: Transaction
  isEditMode?: boolean
}) {
  const [value, setValue] = useState(initialValue)

  return (
    <ExpenseForm value={value} onChange={setValue} isEditMode={isEditMode} />
  )
}

function IncomeFormHarness({
  initialValue = createTransactionFixture({
    type: 'income',
    receivedByUserId: userList[0]!.id,
  }),
  isEditMode = false,
}: {
  initialValue?: Transaction
  isEditMode?: boolean
}) {
  const [value, setValue] = useState(initialValue)

  return <IncomeForm value={value} onChange={setValue} isEditMode={isEditMode} />
}

describe('transaction form tags', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    setMockSuggestionsByBook({})
  })

  it('adds a clicked suggestion and still allows manual entry when no suggestions are available', () => {
    const onTagsChange = jest.fn()

    const { rerender } = render(
      <TagInput
        label="transactionForm.tags"
        data={{ keywords: ['meal'] }}
        suggestions={['meal', 'travel']}
        onTagsChange={onTagsChange}
      />
    )

    expect(screen.queryByRole('button', { name: 'meal' })).toBeNull()
    expect(screen.getByTestId('tag-input-field').textContent).toContain('meal')

    const suggestionButton = screen.getByRole('button', { name: 'travel' })

    expect(suggestionButton.className).toContain('hover:bg-default-')

    fireEvent.click(suggestionButton)

    expect(onTagsChange).toHaveBeenLastCalledWith(['meal', 'travel'])

    const input = screen.getByLabelText('transactionForm.tags')

    fireEvent.keyDown(input, { key: 'Backspace' })

    expect(onTagsChange).toHaveBeenLastCalledWith(['meal'])

    rerender(
      <TagInput
        label="transactionForm.tags"
        data={{ keywords: [] }}
        suggestions={[]}
        onTagsChange={onTagsChange}
      />
    )

    fireEvent.change(input, { target: { value: 'custom-tag' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onTagsChange).toHaveBeenLastCalledWith(['custom-tag'])
  })

  it('converts non-empty input value into a tag on blur', () => {
    const onTagsChange = jest.fn()
    const onBlur = jest.fn()

    render(
      <TagInput
        label="transactionForm.tags"
        data={{ keywords: [] }}
        onTagsChange={onTagsChange}
        onBlur={onBlur}
      />
    )

    const input = screen.getByLabelText('transactionForm.tags')

    fireEvent.change(input, { target: { value: 'blur-tag' } })
    fireEvent.blur(input)

    expect(onTagsChange).toHaveBeenCalledWith(['blur-tag'])
    expect(onBlur).toHaveBeenCalled()
    expect((input as HTMLInputElement).value).toBe('')
  })

  it('does not show a duplicate warning for a valid hyphenated tag', () => {
    render(
      <TagInput
        label="transactionForm.tags"
        data={{ keywords: ['test0610-1'] }}
        suggestions={['test0610']}
        onTagsChange={jest.fn()}
      />
    )

    expect(
      screen.queryByText('Duplicate tags are not allowed. Please remove duplicates.')
    ).toBeNull()
    expect(screen.getByTestId('tag-input-field').textContent).toContain(
      'test0610-1'
    )
  })

  it('updates expense form suggestions when the selected account book changes', () => {
    setMockSuggestionsByBook({
      'book-1': { suggestions: ['groceries'] },
      'book-2': { suggestions: ['travel'] },
    })

    render(<ExpenseFormHarness />)

    expect(screen.getByRole('button', { name: 'groceries' })).not.toBeNull()

    fireEvent.change(screen.getByLabelText('transactionForm.accountBook'), {
      target: { value: 'book-2' },
    })

    expect(screen.getByRole('button', { name: 'travel' })).not.toBeNull()
    expect(screen.queryByRole('button', { name: 'groceries' })).toBeNull()
  })

  it('updates income form suggestions when the selected account book changes in edit mode', () => {
    setMockSuggestionsByBook({
      'book-1': { suggestions: ['salary-tag'] },
      'book-2': { suggestions: ['bonus-tag'] },
    })

    render(<IncomeFormHarness isEditMode />)

    expect(screen.getByRole('button', { name: 'salary-tag' })).not.toBeNull()

    fireEvent.change(screen.getByLabelText('transactionForm.accountBook'), {
      target: { value: 'book-2' },
    })

    expect(screen.getByRole('button', { name: 'bonus-tag' })).not.toBeNull()
    expect(screen.queryByRole('button', { name: 'salary-tag' })).toBeNull()
  })

  it('keeps the tag input editable and clears stale suggestions during account-book loading transitions', () => {
    setMockSuggestionsByBook({
      'book-1': { suggestions: ['groceries'] },
      'book-2': { suggestions: [] },
    })

    render(<ExpenseFormHarness />)

    expect(screen.getByRole('button', { name: 'groceries' })).not.toBeNull()

    fireEvent.change(screen.getByLabelText('transactionForm.accountBook'), {
      target: { value: 'book-2' },
    })

    const input = screen.getByLabelText('transactionForm.tags')

    expect((input as HTMLInputElement).disabled).toBe(false)
    expect(screen.queryByRole('button', { name: 'groceries' })).toBeNull()

    fireEvent.change(input, { target: { value: 'manual-during-load' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(screen.getByText('manual-during-load')).not.toBeNull()
  })
})