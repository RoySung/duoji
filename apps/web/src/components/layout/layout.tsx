import { HeroUIProvider } from '@heroui/react'
import NavBar from './navbar'

function Providers({ children }: { children: React.ReactNode }) {
  return <HeroUIProvider>{children}</HeroUIProvider>
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Providers>
        <main className="h-[calc(100vh-72px)]">{children}</main>
        <NavBar />
      </Providers>
    </>
  )
}
