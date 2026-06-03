import { HeroUIProvider } from '@heroui/react'
import { ToastProvider } from '@heroui/toast'
import Header from './header'
import NavBar from './navbar'

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ToastProvider placement="top-center" />
      {children}
    </HeroUIProvider>
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Providers>
        <div className="fixed inset-0 flex min-h-0 flex-col overflow-hidden bg-background">
          <Header />
          <main className="min-h-0 flex-1 overflow-hidden">{children}</main>
          <NavBar />
        </div>
      </Providers>
    </>
  )
}
