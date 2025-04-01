import { Button, HeroUIProvider } from '@heroui/react'
import Link from 'next/link'

function Providers({ children }: { children: React.ReactNode }) {
  return <HeroUIProvider>{children}</HeroUIProvider>
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Providers>
        <div className="navbar flex w-full gap-4 bg-gray-400 p-4">
          <Link href="/">
            <Button color="primary">Index</Button>
          </Link>
          <Link href="/login">
            <Button color="primary">Login</Button>
          </Link>
          <Link href="/settings">
            <Button color="primary">Settings</Button>
          </Link>
        </div>
        <main>{children}</main>
      </Providers>
    </>
  )
}
