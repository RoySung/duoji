import { HeroUIProvider } from '@heroui/react'
import { ToastProvider } from '@heroui/toast'
import type { ReactNode } from 'react'

import packageJson from '../../../package.json'

type EntryShellProps = {
  children: ReactNode
}

export default function EntryShell({ children }: EntryShellProps) {
  return (
    <HeroUIProvider>
      <ToastProvider placement="top-center" />
      <div
        className="relative h-dvh overflow-y-auto bg-background text-foreground"
        data-ui="entry-shell"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <span className="absolute -left-28 top-16 size-64 rounded-full bg-peach/45 dark:bg-peach/20" />
          <span className="absolute -right-32 bottom-16 size-72 rounded-full bg-accent/20 dark:bg-accent/10" />
          <span className="absolute -bottom-32 left-[12%] h-56 w-72 rotate-[-12deg] bg-secondary/70 dark:bg-secondary/45" />
          <span className="absolute -bottom-32 right-[8%] h-52 w-64 rotate-[14deg] bg-peach/35 dark:bg-peach/15" />
        </div>

        <div className="relative mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 sm:px-6">
          <header
            className="flex min-h-16 shrink-0 items-center pt-[env(safe-area-inset-top)]"
            data-testid="entry-header"
          >
            <span className="text-title font-semibold tracking-[-0.03em]">
              Duoji
              <span className="ml-2 align-middle text-label font-normal tracking-normal text-primary">
                v{packageJson.version}
              </span>
            </span>
          </header>

          <main className="flex min-h-0 flex-1 items-center py-6 sm:py-10">
            {children}
          </main>
        </div>
      </div>
    </HeroUIProvider>
  )
}
