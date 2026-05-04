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
        'rounded-3xl border border-dashed border-border bg-background px-5 py-12 text-center',
        className
      )}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary-300">
        {icon}
      </div>
      {title ? (
        <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      ) : null}
      <p className={cn('text-sm text-muted-foreground', title ? 'mt-2' : 'mt-4')}>
        {description}
      </p>
    </div>
  )
}
