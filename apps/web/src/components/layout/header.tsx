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
    <header className="flex h-[calc(56px+env(safe-area-inset-top))] shrink-0 items-center justify-between border-b border-border bg-background px-4 pt-[env(safe-area-inset-top)]">
      <span className="text-base font-semibold tracking-tight text-foreground">
        Duoji <span className="text-[10px] text-muted-foreground font-normal ml-1">v{packageJson.version}</span>
      </span>
      {isAccountBookRoute && (
        <AccountBookMenu
          accountBooks={accountBooks}
          currentAccountBook={currentAccountBook}
        />
      )}
    </header>
  )
}
