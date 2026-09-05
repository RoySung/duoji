export const settlementModalClassNames = {
  wrapper: 'items-end sm:items-center',
  base: 'mx-0 mb-0 mt-auto w-full max-w-none rounded-t-2xl bg-card text-card-foreground shadow-lg sm:mx-4 sm:my-16 sm:max-w-2xl sm:rounded-2xl',
  closeButton:
    'right-2 top-2 min-h-11 min-w-11 text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
}

export const settlementFormModalClassNames = {
  ...settlementModalClassNames,
  base: 'mx-0 mb-0 mt-auto w-full max-w-none rounded-t-2xl bg-card text-card-foreground shadow-lg sm:mx-4 sm:my-16 sm:max-w-xl sm:rounded-2xl',
}

export const settlementModalContentClassName =
  'flex min-h-0 max-h-[calc(100dvh-env(safe-area-inset-top))] flex-col overflow-hidden sm:max-h-[calc(100dvh-4rem)]'

export const settlementModalHeaderClassName =
  'shrink-0 border-b border-border px-5 py-4 pr-14 sm:px-6 sm:pr-16'

export const settlementModalBodyClassName =
  'min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain px-5 py-5 [-webkit-overflow-scrolling:touch] sm:px-6'

export const settlementModalFooterClassName =
  'grid shrink-0 grid-cols-2 gap-3 border-t border-border bg-card px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:px-6 sm:pb-4'

export const settlementModalActionClassName =
  'min-h-11 w-full rounded-xl px-4 text-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
