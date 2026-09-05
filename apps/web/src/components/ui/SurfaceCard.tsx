import * as React from 'react'

import { cn } from '@/lib/utils'

export type SurfaceCardProps = React.HTMLAttributes<HTMLDivElement>

const SurfaceCard = React.forwardRef<HTMLDivElement, SurfaceCardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('surface-card', className)}
      data-ui="surface-card"
      {...props}
    />
  )
)

SurfaceCard.displayName = 'SurfaceCard'

export { SurfaceCard }
