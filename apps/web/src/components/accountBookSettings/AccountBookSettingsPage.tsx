import { Button, Chip } from '@heroui/react'
import { useRouter } from 'next/router'
import { useAccountBookStore } from '@/stores/accountBook'
import AccountBookNavHeader from './AccountBookNavHeader'

export default function AccountBookSettingsPage() {
  const router = useRouter()
  const accountBooks = useAccountBookStore((state) => state.accountBooks)
  const currentAccountBookId = useAccountBookStore(
    (state) => state.currentAccountBookId
  )
  const error = useAccountBookStore((state) => state.error)

  return (
    <div className="h-full overflow-y-auto bg-background text-foreground">
      <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col gap-6 px-4 py-6 md:px-6">
        <AccountBookNavHeader
          title="Account books"
          subtitle="Review every account book you created here, then open the one you want to manage."
          backHref="/settings"
        />

        {accountBooks.length > 0 ? (
          <section className="flex flex-col gap-4 rounded-2xl bg-muted/40 px-4 py-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
            <p>
              {accountBooks.length === 1
                ? '1 account book'
                : `${accountBooks.length} account books`}
            </p>

            <Button
              className="w-full md:w-auto"
              color="primary"
              disableRipple
              radius="full"
              onPress={() => void router.push('/settings/account-books/new')}
            >
              New account book
            </Button>
          </section>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger-700">
            {error}
          </div>
        ) : null}

        {accountBooks.length === 0 ? (
          <section className="flex flex-1 flex-col items-start justify-center rounded-3xl border border-dashed border-border bg-card/60 px-6 py-12 text-left">
            <div className="max-w-lg space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Start here
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Create your first account book
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Create an account book first, then you can separate daily life,
                trips, side projects, or any other spending context into their
                own space.
              </p>
            </div>
            <Button
              className="mt-6"
              color="primary"
              disableRipple
              radius="full"
              onPress={() => void router.push('/settings/account-books/new')}
            >
              Create account book
            </Button>
          </section>
        ) : (
          <section className="overflow-hidden rounded-3xl border border-border bg-card/80 pb-2">
            {accountBooks.map((accountBook) => {
              const isCurrent = accountBook.id === currentAccountBookId

              return (
                <article
                  key={accountBook.id}
                  className={`flex flex-col gap-4 px-4 py-5 transition-colors md:flex-row md:items-center md:justify-between md:px-5 ${
                    isCurrent
                      ? 'bg-primary-50/80'
                      : 'bg-transparent hover:bg-muted/35'
                  }`}
                  data-testid={`account-book-card-${accountBook.id}`}
                >
                  <div className="min-w-0 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-foreground md:text-xl">
                        {accountBook.name}
                      </h2>
                      <Chip
                        className="bg-muted text-muted-foreground"
                        size="sm"
                        variant="flat"
                      >
                        {accountBook.currency}
                      </Chip>
                      {isCurrent ? (
                        <Chip
                          className="bg-orange-100 text-orange-700"
                          size="sm"
                          variant="flat"
                        >
                          Current on Home
                        </Chip>
                      ) : null}
                    </div>
                    <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                      {accountBook.description ||
                        'No description yet. Open this account book to add details and related settings.'}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2 md:justify-end">
                    <Button
                      disableRipple
                      color="primary"
                      radius="full"
                      variant="flat"
                      onPress={() =>
                        void router.push(
                          `/settings/account-books/${accountBook.id}`
                        )
                      }
                    >
                      View settings
                    </Button>
                  </div>
                </article>
              )
            })}
          </section>
        )}
      </div>
    </div>
  )
}
