import { Button } from '@heroui/react'
import { useRouter } from 'next/router'
import { PiBooksBold, PiCaretRightBold } from 'react-icons/pi'

export default function Settings() {
  const router = useRouter()

  return (
    <div
      id="settings-page"
      className="h-full overflow-y-auto bg-background text-foreground"
    >
      <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col gap-8 px-4 py-8">
        <section className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange-300">
            Settings
          </p>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Personal workspace
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Manage the local account books that power transaction entry and
              account-book-scoped views.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-4 shadow-lg shadow-black/5">
          <Button
            className="h-auto w-full justify-between rounded-2xl bg-accent px-4 py-4 text-left text-foreground hover:bg-accent/80"
            disableRipple
            endContent={<PiCaretRightBold className="text-muted-foreground" />}
            startContent={
              <div className="rounded-2xl bg-orange-400/15 p-3 text-orange-300">
                <PiBooksBold size={20} />
              </div>
            }
            variant="light"
            onPress={() => router.push('/settings/account-books')}
          >
            <div className="flex flex-1 flex-col items-start gap-1">
              <span className="text-base font-semibold">Account books</span>
              <span className="text-sm text-muted-foreground">
                Create, edit, and delete the local account books used in DuoJi.
              </span>
            </div>
          </Button>
        </section>
      </div>
    </div>
  )
}
