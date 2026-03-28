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
    <header className="flex flex-col gap-4 border-b border-border/70 pb-4 md:flex-row md:items-start md:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <Button
          aria-label="Go back"
          className="border border-border bg-background text-foreground hover:bg-muted"
          disableRipple
          isIconOnly
          radius="full"
          variant="flat"
          onPress={handleBack}
        >
          <PiArrowLeftBold size={18} />
        </Button>
        <div className="min-w-0 space-y-1.5 pt-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </header>
  )
}
