type Props = {
  difference: number
}

export function DetailBalanceNotice({ difference }: Props) {
  if (difference === 0) {
    return <div aria-hidden className="h-8" />
  }

  return (
    <div aria-live="polite" className="flex h-8 items-center justify-end">
      <span
        className={
          difference > 0
            ? 'text-body font-semibold tabular-nums text-success-700 dark:text-success-400'
            : 'text-body font-semibold tabular-nums text-danger-700 dark:text-danger-300'
        }
      >
        {difference > 0 ? `+${difference}` : difference}
      </span>
    </div>
  )
}
