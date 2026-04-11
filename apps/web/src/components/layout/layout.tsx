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
        <Header />
        <main className="h-[calc(100dvh-128px)]">{children}</main>
        <NavBar />
      </Providers>
    </>
  )
}
