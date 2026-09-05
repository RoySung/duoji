import { Button, type ButtonProps as HeroButtonProps } from '@heroui/react'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type AppButtonTone =
  | 'primary'
  | 'danger'
  | 'success'
  | 'warning'
  | 'neutral'

export type AppButtonAppearance = 'solid' | 'flat' | 'light' | 'ghost'

export interface AppButtonProps
  extends Omit<HeroButtonProps, 'color' | 'variant'> {
  /** The action's semantic meaning, mapped to the HeroUI color palette. */
  tone?: AppButtonTone
  /** The visual treatment for the action, mapped to the HeroUI variant. */
  appearance?: AppButtonAppearance
}

const toneColor: Record<AppButtonTone, NonNullable<HeroButtonProps['color']>> =
  {
    primary: 'primary',
    danger: 'danger',
    success: 'success',
    warning: 'warning',
    neutral: 'default',
  }

const appearanceVariant: Record<
  AppButtonAppearance,
  NonNullable<HeroButtonProps['variant']>
> = {
  solid: 'solid',
  flat: 'flat',
  light: 'light',
  ghost: 'ghost',
}

/**
 * Application-owned semantic entry point for HeroUI buttons.
 *
 * Solid primary, danger, and success treatments receive their white foreground
 * from the shared HeroUI theme. Other treatments intentionally retain HeroUI's
 * contrast-appropriate foregrounds.
 */
export const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  ({ className, tone = 'primary', appearance = 'solid', ...props }, ref) => {
    const usesWhiteSolidForeground =
      appearance === 'solid' &&
      (tone === 'primary' || tone === 'danger' || tone === 'success')

    return (
      <Button
        {...props}
        ref={ref}
        className={cn(usesWhiteSolidForeground && '!text-white', className)}
        color={toneColor[tone]}
        variant={appearanceVariant[appearance]}
      />
    )
  }
)

AppButton.displayName = 'AppButton'
