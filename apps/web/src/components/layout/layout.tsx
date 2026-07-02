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
          <main className="relative min-h-0 flex-1 overflow-hidden layout-main">
            {children}
            <div className="absolute bottom-0 left-0 right-0 z-50 pointer-events-none">
              <div className="pointer-events-auto">
                <NavBar />
              </div>
            </div>
          </main>
        </div>
      </Providers>
    </>
  )
}
