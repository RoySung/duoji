import * as React from 'react'

import { cn } from '@/lib/utils'

export type PageScaffoldProps = React.HTMLAttributes<HTMLDivElement>

const PageScaffold = React.forwardRef<HTMLDivElement, PageScaffoldProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('page-scaffold', className)}
      data-ui="page-scaffold"
      {...props}
    />
  )
)

PageScaffold.displayName = 'PageScaffold'

export { PageScaffold }
