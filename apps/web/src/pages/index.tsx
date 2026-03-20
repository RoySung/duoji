import { Button } from '@heroui/react'
import { useRouter } from 'next/router'
import { PiBooksBold, PiCaretRightBold } from 'react-icons/pi'
import { useAccountBookStore } from '@/stores/accountBook'

export function Index() {
  const router = useRouter()
  const accountBooks = useAccountBookStore((state) => state.accountBooks)
  const currentAccountBookId = useAccountBookStore(
    (state) => state.currentAccountBookId
  )
  const isLoading = useAccountBookStore((state) => state.isLoading)
  const setCurrentAccountBook = useAccountBookStore(
    (state) => state.setCurrentAccountBook
  )

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
                <label
                  className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground"
                  htmlFor="home-account-book-select"
                >
                  Account book
                </label>
                <div className="relative overflow-hidden rounded-3xl border border-border bg-background shadow-sm transition hover:bg-accent/70">
                  <select
                    aria-label="Current account book"
                    className="min-h-[72px] w-full appearance-none bg-transparent px-4 pr-14 text-base font-semibold text-foreground outline-none disabled:cursor-wait"
                    data-testid="home-account-book-select-input"
                    disabled={isLoading}
                    id="home-account-book-select"
                    value={currentAccountBookId ?? ''}
                    onChange={(event) => {
                      const nextAccountBookId = event.target.value

                      if (
                        !nextAccountBookId ||
                        nextAccountBookId === currentAccountBookId
                      ) {
                        return
                      }

                      setCurrentAccountBook(nextAccountBookId)
                    }}
                  >
                    {accountBooks.map((accountBook) => (
                      <option key={accountBook.id} value={accountBook.id}>
                        {accountBook.name} ({accountBook.currency})
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <PiCaretRightBold className="rotate-90" />
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Index
