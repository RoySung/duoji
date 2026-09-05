import { useRouter } from 'next/router'
import { useAccountBookStore } from '@/stores/accountBook'
import AccountBookMenu from '@/components/accountBook/AccountBookMenu'

import packageJson from '../../../package.json'

const ACCOUNT_BOOK_ROUTE_REGEX = /^\/account-books\/\[id\](\/.*)?$/

export default function Header() {
  const router = useRouter()
  const accountBooks = useAccountBookStore((state) => state.accountBooks)

  const isAccountBookRoute = ACCOUNT_BOOK_ROUTE_REGEX.test(router.pathname)
  const currentId = typeof router.query.id === 'string' ? router.query.id : null
  const currentAccountBook =
    accountBooks.find((ab) => ab.id === currentId) ?? null

  return (
    <header
      className="h-[calc(64px+env(safe-area-inset-top))] shrink-0 bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur-md"
      data-testid="app-header"
    >
      <div
        className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between gap-3 px-4 sm:px-6"
        data-testid="app-header-frame"
      >
        <span className="shrink-0 text-lg font-semibold tracking-[-0.03em] text-foreground">
          Duoji
          <span className="ml-2 align-middle text-xs font-normal tracking-normal text-primary">
            v{packageJson.version}
          </span>
        </span>
        {isAccountBookRoute && (
          <AccountBookMenu
            accountBooks={accountBooks}
            currentAccountBook={currentAccountBook}
          />
        )}
      </div>
    </header>
  )
}
