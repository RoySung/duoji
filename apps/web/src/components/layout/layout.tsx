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
    <Providers>
      <div
        className="fixed inset-0 flex min-h-0 flex-col overflow-hidden bg-background"
        data-ui="app-shell"
      >
        <Header />
        <main className="layout-main relative min-h-0 flex-1 overflow-hidden">
          {children}
        </main>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-50">
          <div className="pointer-events-auto">
            <NavBar />
          </div>
        </div>
      </div>
    </Providers>
  )
}
