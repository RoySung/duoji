import type { InputProps } from '@heroui/react'

export const amountInputClassNames: NonNullable<InputProps['classNames']> = {
  label: 'text-sm font-semibold text-foreground',
  inputWrapper: 'h-16 min-h-16 gap-0 px-4 py-2.5',
  innerWrapper:
    'h-full items-center gap-2 box-border group-data-[has-label=true]:items-end',
  input:
    'text-right text-2xl font-semibold leading-none tracking-tight tabular-nums text-foreground',
}

export const amountInputCurrencyClassName =
  'text-xl font-semibold leading-none text-default-500'