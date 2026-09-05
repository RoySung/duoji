import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ReportEmptyStateProps = {
  icon: ReactNode
  title?: string
  description: string
  className?: string
}

export default function ReportEmptyState({
  icon,
  title,
  description,
  className,
}: ReportEmptyStateProps) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-secondary/70 px-5 py-10 text-center',
        className
      )}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
        {icon}
      </div>
      {title ? (
        <h3 className="mt-4 text-title font-semibold leading-snug text-foreground text-balance">
          {title}
        </h3>
      ) : null}
      <p
        className={cn(
          'mx-auto max-w-[65ch] text-body text-muted-foreground text-pretty',
          title ? 'mt-2' : 'mt-4'
        )}
      >
        {description}
      </p>
    </div>
  )
}
