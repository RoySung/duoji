import { Button, Chip, Select, SelectItem } from '@heroui/react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { PiBooksBold, PiCaretRightBold } from 'react-icons/pi'
import TransactionList from '@/components/transaction/TransactionList'
import { useAccountBookStore } from '@/stores/accountBook'
import { useTransactionStore } from '@/stores/transaction'

export function Index() {
  const router = useRouter()
  const accountBooks = useAccountBookStore((state) => state.accountBooks)
  const currentAccountBookId = useAccountBookStore(
    (state) => state.currentAccountBookId
  )
  const isAccountBooksLoading = useAccountBookStore((state) => state.isLoading)
  const setCurrentAccountBook = useAccountBookStore(
    (state) => state.setCurrentAccountBook
  )
  const transactions = useTransactionStore((state) => state.transactions)
  const transactionError = useTransactionStore((state) => state.error)
  const isTransactionsLoading = useTransactionStore((state) => state.isLoading)
  const loadTransactions = useTransactionStore(
    (state) => state.loadTransactions
  )
  const openEditModal = useTransactionStore((state) => state.openEditModal)
  const currentAccountBook = accountBooks.find(
    (accountBook) => accountBook.id === currentAccountBookId
  )
  const isBookSelectorLoading = isAccountBooksLoading || isTransactionsLoading

  useEffect(() => {
    void loadTransactions(currentAccountBookId)
  }, [currentAccountBookId, loadTransactions])

  return (
    <div className="h-full overflow-y-auto bg-background text-foreground">
      <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col gap-8 px-4 py-8">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-lg shadow-black/5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange-300">
                Home
              </p>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                  Current account book
                </h1>
                <p className="max-w-2xl text-sm text-muted-foreground">
                  Choose which account book powers transaction entry and
                  account-book-scoped views.
                </p>
              </div>
            </div>

            <Button
              className="bg-accent text-foreground hover:bg-accent/80"
              disableRipple
              endContent={
                <PiCaretRightBold className="text-muted-foreground" />
              }
              variant="flat"
              onPress={() => router.push('/settings/account-books')}
            >
              Manage books
            </Button>
          </div>

          {accountBooks.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-border bg-accent/40 px-5 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-400/15 text-orange-300">
                <PiBooksBold size={22} />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-foreground">
                No account books yet
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Go to settings to create your first local account book.
              </p>
              <Button
                className="mt-6"
                color="primary"
                disableRipple
                onPress={() => router.push('/settings/account-books')}
              >
                Open account-book settings
              </Button>
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              <div data-testid="home-account-book-selector">
                <Select
                  aria-label="Current account book"
                  classNames={{
                    base: 'w-full',
                    label:
                      'mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground',
                    trigger:
                      'min-h-[72px] rounded-3xl border border-border bg-background px-4 text-base font-semibold text-foreground shadow-sm transition data-[hover=true]:bg-accent/70',
                    value: 'text-base font-semibold text-foreground',
                  }}
                  data-testid="home-account-book-select-input"
                  isLoading={isBookSelectorLoading}
                  isDisabled={isBookSelectorLoading}
                  label="Account book"
                  labelPlacement="outside"
                  placeholder="Select an account book"
                  selectedKeys={
                    currentAccountBookId ? [currentAccountBookId] : []
                  }
                  onSelectionChange={(keys) => {
                    const nextAccountBookId = Array.from(keys)[0]

                    if (
                      typeof nextAccountBookId !== 'string' ||
                      !nextAccountBookId ||
                      nextAccountBookId === currentAccountBookId
                    ) {
                      return
                    }

                    setCurrentAccountBook(nextAccountBookId)
                  }}
                >
                  {accountBooks.map((accountBook) => (
                    <SelectItem
                      key={accountBook.id}
                      textValue={`${accountBook.name} (${accountBook.currency})`}
                    >
                      {accountBook.name} ({accountBook.currency})
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          )}
        </section>

        {accountBooks.length > 0 ? (
          <section className="rounded-3xl border border-border bg-card p-6 shadow-lg shadow-black/5">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange-300">
                  Transactions
                </p>
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    Current account book history
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Select a transaction row to reopen it in edit without
                    leaving Home.
                  </p>
                </div>
              </div>
              <Chip
                className="self-start bg-accent text-muted-foreground"
                size="sm"
                variant="flat"
              >
                {transactions.length} records
              </Chip>
            </div>

            <TransactionList
              currency={currentAccountBook?.currency ?? null}
              error={transactionError}
              isLoading={isTransactionsLoading}
              transactions={transactions}
              onEditTransaction={openEditModal}
            />
          </section>
        ) : null}
      </div>
    </div>
  )
}

export default Index
