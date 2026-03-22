import { HeroUIProvider } from '@heroui/react'
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { useRouter } from 'next/router'
import Home from '../src/pages/index'
import NavBar from '../src/components/layout/navbar'
import { AccountBook, AccountBookRepo } from '../src/entities/accountBook'
import {
  DefaultPaymentMethod,
  Transaction,
  TransactionRepo,
} from '../src/entities/transaction'
import {
  AccountBookStoreProvider,
  createAccountBookStore,
} from '../src/stores/accountBook'
import {
  TransactionStoreProvider,
  createTransactionStore,
} from '../src/stores/transaction'
import { userList } from '../src/mocks'

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@heroui/react', () => {
  const actual = jest.requireActual('@heroui/react')
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
    ...actual,
    addToast: jest.fn(),
    Button: ({
      children,
      disableRipple,
      disabled,
      endContent,
      isIconOnly,
      isDisabled,
      onClick,
      onPress,
      startContent,
      ...props
    }: any) => (
      <button
        type="button"
        disabled={disabled ?? isDisabled}
        onClick={onPress ?? onClick}
        {...props}
      >
        {startContent}
        {children}
        {endContent}
      </button>
    ),
    Modal: ({ children, isOpen }: any) =>
      isOpen ? <div role="dialog">{children}</div> : null,
    ModalContent: ({ children }: any) => <div>{children}</div>,
    ModalHeader: ({ children }: any) => <div>{children}</div>,
    ModalBody: ({ children }: any) => <div>{children}</div>,
    ModalFooter: ({ children }: any) => <div>{children}</div>,
    ScrollShadow: ({ children }: any) => <div>{children}</div>,
    Tabs: ({ children, onSelectionChange, selectedKey }: any) => {
      const tabs = React.Children.toArray(children).filter(React.isValidElement)

      return (
        <div>
          {tabs.map((child: any) => {
            const tabKey = String(child.key ?? '').replace(/^[.$]+/, '')

            return (
              <button
                key={tabKey}
                aria-pressed={selectedKey === tabKey}
                type="button"
                onClick={() => onSelectionChange?.(tabKey)}
              >
                {child.props.title}
              </button>
            )
          })}
        </div>
      )
    },
    Tab: ({ children }: any) => <div>{children}</div>,
    Select: ({
      'aria-label': ariaLabel,
      children,
      'data-testid': dataTestId,
      id,
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
          {label ? <span>{label}</span> : null}
          <select
            aria-label={ariaLabel ?? label}
            data-testid={dataTestId}
            disabled={isDisabled}
            id={id}
            multiple={isMultiple}
            value={isMultiple ? selectedValues : selectedValues[0] ?? ''}
            onChange={(event) => {
              const nextValues = isMultiple
                ? Array.from(
                    event.currentTarget.selectedOptions,
                    (option) => option.value
                  )
                : [event.currentTarget.value]

              onSelectionChange?.(new Set(nextValues.filter(Boolean)))
            }}
          >
            {getOptionElements(children, items)}
          </select>
        </label>
      )
    },
    SelectItem: () => null,
  }
})

jest.mock('../src/components/TransactionModal/ExpenseForm', () => ({
  __esModule: true,
  default: function MockExpenseForm({
    value,
    onChange,
  }: {
    value: Transaction
    onChange: (nextValue: Transaction) => void
  }) {
    const { PaymentMethodValues } = require('../src/entities/transaction')

    return (
      <div>
        <label>
          Description
          <input
            aria-label="Description"
            value={value.description}
            onChange={(event) =>
              onChange({
                ...value,
                description: event.target.value,
              })
            }
          />
        </label>
        <label>
          Payment Method
          <select
            aria-label="Payment Method"
            value={value.paymentMethod}
            onChange={(event) =>
              onChange({
                ...value,
                paymentMethod: event.target
                  .value as Transaction['paymentMethod'],
              })
            }
          >
            {PaymentMethodValues.map((paymentMethod: string) => (
              <option key={paymentMethod} value={paymentMethod}>
                {paymentMethod}
              </option>
            ))}
          </select>
        </label>
      </div>
    )
  },
}))

jest.mock('../src/components/TransactionModal/IncomeForm', () => ({
  __esModule: true,
  default: function MockIncomeForm({
    value,
    onChange,
  }: {
    value: Transaction
    onChange: (nextValue: Transaction) => void
  }) {
    const { PaymentMethodValues } = require('../src/entities/transaction')
    const { userList } = require('../src/mocks')
    const {
      applyIncomeRecipient,
      distributeTransactionAmount,
    } = require('../src/utils/transactionUtils')

    return (
      <div>
        <label>
          Amount
          <input
            aria-label="Amount"
            type="number"
            value={value.amount.toString()}
            onChange={(event) =>
              onChange(
                distributeTransactionAmount(
                  value,
                  Number(event.target.value) || 0
                )
              )
            }
          />
        </label>
        <label>
          Description
          <input
            aria-label="Description"
            value={value.description}
            onChange={(event) =>
              onChange({
                ...value,
                description: event.target.value,
              })
            }
          />
        </label>
        <label>
          Payment Method
          <select
            aria-label="Payment Method"
            value={value.paymentMethod}
            onChange={(event) =>
              onChange({
                ...value,
                paymentMethod: event.target
                  .value as Transaction['paymentMethod'],
              })
            }
          >
            {PaymentMethodValues.map((paymentMethod: string) => (
              <option key={paymentMethod} value={paymentMethod}>
                {paymentMethod}
              </option>
            ))}
          </select>
        </label>
        <label>
          Received By
          <select
            aria-label="Received By"
            value={value.receivedByUserId ?? ''}
            onChange={(event) =>
              onChange(applyIncomeRecipient(value, event.target.value || null))
            }
          >
            {userList.map((user: { id: string; name: string }) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    )
  },
}))

const mockedUseRouter = useRouter as jest.Mock
const baseTimestamp = 1710000000000

function createAccountBookFixture(
  overrides: Partial<AccountBook> = {}
): AccountBook {
  return {
    id: 'book-1',
    name: 'Daily Life',
    currency: 'TWD',
    description: 'Personal daily expenses',
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
    ownerId: '1',
    userIds: ['1', '2'],
    ...overrides,
  }
}

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

class InMemoryAccountBookRepo implements AccountBookRepo {
  private accountBooks: AccountBook[]

  constructor(accountBooks: AccountBook[] = []) {
    this.accountBooks = [...accountBooks]
  }

  async create(accountBook: AccountBook): Promise<AccountBook> {
    this.accountBooks.push(accountBook)
    return accountBook
  }

  async findById(id: string): Promise<AccountBook | null> {
    return (
      this.accountBooks.find((accountBook) => accountBook.id === id) ?? null
    )
  }

  async findAll(): Promise<AccountBook[]> {
    return [...this.accountBooks]
  }

  async update(
    id: string,
    updates: Partial<AccountBook>
  ): Promise<AccountBook | null> {
    const index = this.accountBooks.findIndex(
      (accountBook) => accountBook.id === id
    )

    if (index === -1) {
      return null
    }

    const updatedAccountBook = {
      ...this.accountBooks[index],
      ...updates,
    }
    this.accountBooks[index] = updatedAccountBook
    return updatedAccountBook
  }

  async delete(id: string): Promise<boolean> {
    const nextAccountBooks = this.accountBooks.filter(
      (accountBook) => accountBook.id !== id
    )
    const deleted = nextAccountBooks.length !== this.accountBooks.length
    this.accountBooks = nextAccountBooks
    return deleted
  }

  async clear(): Promise<void> {
    this.accountBooks = []
  }
}

class InMemoryTransactionRepo implements TransactionRepo {
  private transactions: Transaction[]

  constructor(transactions: Transaction[] = []) {
    this.transactions = [...transactions]
  }

  async create(transaction: Transaction): Promise<Transaction> {
    this.transactions.push(transaction)
    return transaction
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = this.transactions.find(
      (t) => t.id === id && t.deletedAt === null
    )
    return transaction ?? null
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactions.filter((t) => t.deletedAt === null)
  }

  async findByAccountBookId(accountBookId: string): Promise<Transaction[]> {
    return this.transactions.filter(
      (transaction) =>
        transaction.accountBookId === accountBookId &&
        transaction.deletedAt === null
    )
  }

  async update(
    id: string,
    updates: Partial<Transaction>
  ): Promise<Transaction | null> {
    const index = this.transactions.findIndex(
      (transaction) => transaction.id === id
    )

    if (index === -1) {
      return null
    }

    const updatedTransaction = {
      ...this.transactions[index],
      ...updates,
    }
    this.transactions[index] = updatedTransaction
    return updatedTransaction
  }

  async delete(id: string): Promise<boolean> {
    const transaction = this.transactions.find((t) => t.id === id)
    if (!transaction) {
      return false
    }

    // Soft delete: set deletedAt timestamp
    const updatedTransaction = { ...transaction, deletedAt: Date.now() }
    const index = this.transactions.findIndex((t) => t.id === id)
    this.transactions[index] = updatedTransaction
    return true
  }

  async clear(): Promise<void> {
    this.transactions = []
  }
}

type RenderOptions = {
  accountBooks?: AccountBook[]
  currentAccountBookId?: string | null
  transactions?: Transaction[]
}

async function renderWithProviders(options: RenderOptions = {}) {
  mockedUseRouter.mockReturnValue({
    pathname: '/',
    push: jest.fn(),
    back: jest.fn(),
  })

  const accountBookStore = createAccountBookStore(
    new InMemoryAccountBookRepo(
      options.accountBooks ?? [
        createAccountBookFixture({ id: 'book-1', name: 'Daily Life' }),
        createAccountBookFixture({
          id: 'book-2',
          name: 'Travel Fund',
          currency: 'JPY',
        }),
      ]
    )
  )

  await accountBookStore.getState().initialize()

  if (options.currentAccountBookId !== undefined) {
    accountBookStore
      .getState()
      .setCurrentAccountBook(options.currentAccountBookId)
  }

  const transactionStore = createTransactionStore(
    new InMemoryTransactionRepo(
      options.transactions ?? [
        createTransactionFixture({
          id: 'tx-1',
          accountBookId: 'book-1',
          date: '2026/03/19',
          description: 'Breakfast with friends',
          paymentMethod: DefaultPaymentMethod,
        }),
        createTransactionFixture({
          id: 'tx-2',
          accountBookId: 'book-1',
          date: '2026/03/18',
          description: 'Train ticket',
          categoryId: '3-1',
          amount: 80,
          paymentMethod: 'Line Pay',
          paidByDetail: [
            {
              user: userList[1],
              amount: 80,
            },
          ],
          splitDetail: [
            {
              user: userList[0],
              amount: 50,
            },
            {
              user: userList[1],
              amount: 30,
            },
          ],
        }),
        createTransactionFixture({
          id: 'tx-3',
          accountBookId: 'book-2',
          type: 'income',
          categoryId: '101-1',
          description: 'Bonus',
          paymentMethod: 'Credit Card',
          receivedByUserId: userList[0].id,
          amount: 500,
          paidByDetail: [
            {
              user: userList[0],
              amount: 500,
            },
          ],
          splitDetail: [
            {
              user: userList[0],
              amount: 500,
            },
          ],
        }),
      ]
    )
  )

  await transactionStore
    .getState()
    .initialize(accountBookStore.getState().currentAccountBookId)

  let renderResult: ReturnType<typeof render>

  await act(async () => {
    renderResult = render(
      <HeroUIProvider>
        <AccountBookStoreProvider store={accountBookStore}>
          <TransactionStoreProvider store={transactionStore}>
            <div>
              <Home />
              <NavBar />
            </div>
          </TransactionStoreProvider>
        </AccountBookStoreProvider>
      </HeroUIProvider>
    )
  })

  return {
    accountBookStore,
    transactionStore,
    ...renderResult!,
  }
}

describe('Home transaction history', () => {
  beforeEach(() => {
    mockedUseRouter.mockReset()
  })

  it('renders current-account-book transactions in a flat list with summary metadata and updates when the current account book changes', async () => {
    await renderWithProviders({
      currentAccountBookId: 'book-1',
    })

    await waitFor(() => {
      expect(screen.getByTestId('transaction-row-tx-1')).toBeTruthy()
    })

    expect(screen.getByText('Current account book history')).toBeTruthy()
    expect(screen.getByText('2 records')).toBeTruthy()
    expect(screen.getByTestId('transaction-list')).toBeTruthy()
    expect(
      within(screen.getByTestId('transaction-row-tx-1')).getByText('2026/03/19')
    ).toBeTruthy()
    expect(
      within(screen.getByTestId('transaction-row-tx-1')).getByText('Cash')
    ).toBeTruthy()
    expect(
      within(screen.getByTestId('transaction-row-tx-1')).getByText('均分')
    ).toBeTruthy()
    expect(
      within(screen.getByTestId('transaction-row-tx-1')).getByText('Roy')
    ).toBeTruthy()
    expect(
      within(screen.getByTestId('transaction-row-tx-2')).getByText('Patty')
    ).toBeTruthy()
    expect(
      within(screen.getByTestId('transaction-row-tx-2')).queryByText('均分')
    ).toBeNull()
    expect(screen.queryByText('Bonus')).toBeNull()

    fireEvent.change(screen.getByLabelText('Current account book'), {
      target: { value: 'book-2' },
    })

    await waitFor(() => {
      expect(screen.getByText('Bonus')).toBeTruthy()
    })

    expect(screen.getByText('1 records')).toBeTruthy()
    expect(
      within(screen.getByTestId('transaction-row-tx-3')).getByText('Roy')
    ).toBeTruthy()
    expect(screen.queryByText('Breakfast with friends')).toBeNull()
  })

  it('opens the shared edit modal from the home-page list and saves changes back to the row', async () => {
    const { transactionStore } = await renderWithProviders({
      currentAccountBookId: 'book-1',
    })

    await waitFor(() => {
      expect(screen.getByTestId('transaction-row-tx-1')).toBeTruthy()
    })

    const transactionRow = screen.getByTestId('transaction-row-tx-1')

    fireEvent.click(transactionRow)

    await waitFor(() => {
      expect(screen.getByText('Edit Transaction')).toBeTruthy()
    })

    expect(transactionStore.getState().modalMode).toBe('edit')
    expect(transactionStore.getState().selectedTransactionId).toBe('tx-1')

    const paymentMethodSelect = screen.getByLabelText(
      'Payment Method'
    ) as HTMLSelectElement
    const saveButton = screen.getByRole('button', {
      name: 'Save',
    }) as HTMLButtonElement

    expect(paymentMethodSelect.value).toBe(DefaultPaymentMethod)

    fireEvent.change(paymentMethodSelect, {
      target: { value: 'JKO Pay' },
    })

    expect(saveButton.disabled).toBe(false)

    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Updated breakfast note' },
    })
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.queryByText('Edit Transaction')).toBeNull()
    })

    await waitFor(() => {
      expect(screen.getByText('Updated breakfast note')).toBeTruthy()
    })

    expect(
      within(screen.getByTestId('transaction-row-tx-1')).getByText('JKO Pay')
    ).toBeTruthy()
  })

  it('asks for confirmation before deleting a transaction from the shared edit modal', async () => {
    const { transactionStore } = await renderWithProviders({
      currentAccountBookId: 'book-1',
    })

    await waitFor(() => {
      expect(screen.getByTestId('transaction-row-tx-1')).toBeTruthy()
    })

    fireEvent.click(screen.getByTestId('transaction-row-tx-1'))

    await waitFor(() => {
      expect(screen.getByText('Edit Transaction')).toBeTruthy()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(
      screen.getByText('Are you sure you want to delete this transaction?')
    ).toBeTruthy()
    expect(screen.getByTestId('transaction-row-tx-1')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Confirm Delete' }))

    await waitFor(() => {
      expect(screen.queryByText('Edit Transaction')).toBeNull()
    })

    expect(transactionStore.getState().selectedTransactionId).toBeNull()
    expect(screen.queryByTestId('transaction-row-tx-1')).toBeNull()
    expect(screen.getByText('1 records')).toBeTruthy()
  })

  it('prefills new transaction drafts with Cash as the default payment method', async () => {
    const { transactionStore } = await renderWithProviders({
      currentAccountBookId: 'book-1',
    })

    act(() => {
      transactionStore.getState().openCreateModal()
    })

    await waitFor(() => {
      expect(screen.getByText('New Transaction')).toBeTruthy()
    })

    expect(
      (screen.getByLabelText('Payment Method') as HTMLSelectElement).value
    ).toBe(DefaultPaymentMethod)
  })

  it('prefills new income transaction drafts with the current account-book owner as the recipient', async () => {
    const { transactionStore } = await renderWithProviders({
      currentAccountBookId: 'book-2',
    })

    act(() => {
      transactionStore.getState().openCreateModal()
    })

    await waitFor(() => {
      expect(screen.getByText('New Transaction')).toBeTruthy()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Income' }))

    await waitFor(() => {
      expect(
        (screen.getByLabelText('Received By') as HTMLSelectElement).value
      ).toBe('1')
    })
  })

  it('renders the default income recipient summary after creating a new income transaction', async () => {
    const { transactionStore } = await renderWithProviders({
      currentAccountBookId: 'book-2',
    })

    act(() => {
      transactionStore.getState().openCreateModal()
    })

    await waitFor(() => {
      expect(screen.getByText('New Transaction')).toBeTruthy()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Income' }))

    await waitFor(() => {
      expect(
        (screen.getByLabelText('Received By') as HTMLSelectElement).value
      ).toBe('1')
    })

    fireEvent.change(screen.getByLabelText('Amount'), {
      target: { value: '880' },
    })
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'March salary' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Create' }))

    await waitFor(() => {
      expect(screen.queryByText('New Transaction')).toBeNull()
    })

    const descriptionElement = await screen.findByText('March salary')
    const transactionRow = descriptionElement.closest('article')

    expect(transactionRow).not.toBeNull()
    expect(screen.getByText('2 records')).toBeTruthy()
    expect(within(transactionRow as HTMLElement).getByText('Roy')).toBeTruthy()
  })

  it('updates income recipient summaries after editing an income transaction', async () => {
    await renderWithProviders({
      currentAccountBookId: 'book-2',
    })

    await waitFor(() => {
      expect(screen.getByTestId('transaction-row-tx-3')).toBeTruthy()
    })

    fireEvent.click(screen.getByTestId('transaction-row-tx-3'))

    await waitFor(() => {
      expect(screen.getByText('Edit Transaction')).toBeTruthy()
    })

    const recipientSelect = screen.getByLabelText(
      'Received By'
    ) as HTMLSelectElement

    expect(recipientSelect.value).toBe('1')

    fireEvent.change(recipientSelect, {
      target: { value: '2' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(screen.queryByText('Edit Transaction')).toBeNull()
    })

    expect(
      within(screen.getByTestId('transaction-row-tx-3')).getByText('Patty')
    ).toBeTruthy()
  })

  it('disables account-book switching while transactions are loading', async () => {
    const { transactionStore } = await renderWithProviders({
      currentAccountBookId: 'book-1',
    })

    const selector = screen.getByLabelText(
      'Current account book'
    ) as HTMLSelectElement

    expect(selector.disabled).toBe(false)

    act(() => {
      transactionStore.setState({ isLoading: true })
    })

    expect(selector.disabled).toBe(true)
  })
})
