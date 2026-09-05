import type { InputProps } from '@heroui/react'

export const amountInputClassNames: NonNullable<InputProps['classNames']> = {
  label: 'text-body font-semibold text-foreground',
  inputWrapper:
    'h-16 min-h-16 gap-0 rounded-xl border border-transparent bg-content2 px-4 py-2.5 shadow-none transition-colors group-data-[focus=true]:border-primary group-data-[focus=true]:bg-content1 group-data-[invalid=true]:border-danger',
  innerWrapper:
    'h-full items-center gap-2 box-border group-data-[has-label=true]:items-end',
  input:
    'text-right text-xl font-semibold leading-none tracking-tight tabular-nums text-foreground placeholder:text-muted-foreground',
  errorMessage: 'text-label leading-5 text-danger',
}

export const amountInputCurrencyClassName =
  'text-title font-semibold leading-none text-muted-foreground'
