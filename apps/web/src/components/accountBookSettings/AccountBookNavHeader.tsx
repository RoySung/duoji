import { Button } from '@heroui/react'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { PiArrowLeftBold } from 'react-icons/pi'

type AccountBookNavHeaderProps = {
  title: string
  subtitle?: string
  backHref?: string
  actions?: ReactNode
}

export default function AccountBookNavHeader({
  title,
  subtitle,
  backHref,
  actions,
}: AccountBookNavHeaderProps) {
  const router = useRouter()

  function handleBack() {
    if (backHref) {
      void router.push(backHref)
      return
    }

    router.back()
  }

  return (
    <header className="flex items-start justify-between gap-4 rounded-3xl border border-border bg-card px-4 py-4 shadow-lg shadow-black/5">
      <div className="flex min-w-0 items-start gap-3">
        <Button
          aria-label="Go back"
          className="bg-accent text-foreground hover:bg-accent/80"
          disableRipple
          isIconOnly
          radius="full"
          variant="flat"
          onPress={handleBack}
        >
          <PiArrowLeftBold size={18} />
        </Button>
        <div className="min-w-0 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </header>
  )
}