export const compactInputClassNames = {
  label: 'text-body font-medium text-foreground',
  inputWrapper:
    'min-h-11 rounded-xl border border-transparent bg-content2 shadow-none transition-colors group-data-[focus=true]:border-primary group-data-[focus=true]:bg-content1 group-data-[invalid=true]:border-danger',
  input: 'text-body text-foreground placeholder:text-muted-foreground',
  description: 'text-label leading-5 text-muted-foreground',
  errorMessage: 'text-label leading-5 text-danger',
}

export const compactSelectClassNames = {
  label: 'text-body font-medium text-foreground',
  trigger:
    'min-h-11 rounded-xl border border-transparent bg-content2 shadow-none transition-colors data-[focus=true]:border-primary data-[focus=true]:bg-content1 data-[open=true]:border-primary',
  value: 'text-body text-foreground',
  description: 'text-label leading-5 text-muted-foreground',
  errorMessage: 'text-label leading-5 text-danger',
  popoverContent: 'rounded-2xl bg-popover text-popover-foreground shadow-lg',
}

export const compactDatePickerClassNames = {
  label: 'text-body font-medium text-foreground',
  inputWrapper:
    'min-h-11 rounded-xl border border-transparent bg-content2 shadow-none transition-colors group-data-[focus=true]:border-primary group-data-[focus=true]:bg-content1',
  selectorButton:
    '-mr-2 flex h-11 w-11 items-center justify-center text-label text-muted-foreground',
  segment:
    'text-body text-foreground data-[placeholder=true]:text-muted-foreground',
}

export const transactionTabsClassNames = {
  tabList: 'rounded-xl bg-muted p-1',
  cursor: 'rounded-lg bg-card shadow-none',
  tab: 'min-h-11',
  tabContent:
    'text-body font-medium text-muted-foreground group-data-[selected=true]:text-foreground',
}

export const bottomSheetClassNames = {
  base: 'mx-0 mb-0 mt-auto w-full max-w-none rounded-t-2xl bg-card text-card-foreground shadow-lg sm:mx-4 sm:my-16 sm:max-w-xl sm:rounded-2xl',
  wrapper: 'items-end sm:items-center',
  header: 'border-b border-border px-5 py-4 sm:px-6',
  body: 'px-5 py-5 sm:px-6',
  footer: 'border-t border-border px-5 py-4 sm:px-6',
}

export const transactionModalClassNames = {
  base: 'mx-0 mb-0 mt-auto w-full max-w-none rounded-t-2xl bg-card text-card-foreground shadow-lg sm:mx-4 sm:my-16 sm:max-w-2xl sm:rounded-2xl',
  wrapper: 'items-end sm:items-center',
}

export const confirmModalClassNames = {
  base: 'mx-4 max-w-md rounded-2xl bg-card text-card-foreground shadow-lg',
  header: 'border-b border-border px-5 py-4 sm:px-6',
  body: 'px-5 py-5 text-body leading-6 text-muted-foreground sm:px-6',
  footer: 'border-t border-border px-5 py-4 sm:px-6',
}
