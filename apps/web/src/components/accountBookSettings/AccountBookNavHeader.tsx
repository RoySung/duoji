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
    <header className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <Button
          aria-label="Go back"
          className="min-h-11 min-w-11 shrink-0 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-2 focus-visible:ring-ring"
          disableRipple
          isIconOnly
          variant="flat"
          onPress={handleBack}
        >
          <PiArrowLeftBold size={16} />
        </Button>
        <div className="min-w-0 space-y-1 pt-1">
          <h1 className="break-words text-headline font-semibold text-foreground text-balance">
            {title}
          </h1>
          {subtitle ? (
            <p className="max-w-[65ch] text-body text-muted-foreground text-pretty">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </header>
  )
}
