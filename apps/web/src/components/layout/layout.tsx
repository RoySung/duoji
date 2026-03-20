import { HeroUIProvider } from '@heroui/react'
import { ToastProvider } from '@heroui/toast'
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
        <main className="h-[calc(100dvh-72px)]">{children}</main>
        <NavBar />
      </Providers>
    </>
  )
}
