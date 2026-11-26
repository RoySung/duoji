import { useState } from 'react'
import clsx from 'clsx'
import {
  BUILTIN_CATEGORY_ICONS,
  DEFAULT_CATEGORY_ICON_KEY,
} from '@/constants/categoryIcons'
import {
  isCustomCategoryIconUrl,
  type CategoryIcon as CategoryIconValue,
} from '@/entities/category'

type IconAppearance = {
  className?: string
  label?: string
}

type CategoryIconProps = IconAppearance & {
  icon?: CategoryIconValue | null
  onImageError?: () => void
}

function FallbackIcon({ className, label }: IconAppearance) {
  const Icon = BUILTIN_CATEGORY_ICONS[DEFAULT_CATEGORY_ICON_KEY]

  return (
    <Icon
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={className}
      data-category-icon="fallback"
      role={label ? 'img' : undefined}
    />
  )
}

function CustomImage({
  url,
  className,
  label,
  onImageError,
}: IconAppearance & { url: string; onImageError?: () => void }) {
  const [failed, setFailed] = useState(false)

  if (failed) return <FallbackIcon className={className} label={label} />

  return (
    <img
      alt={label ?? ''}
      className={clsx('object-contain', className)}
      data-category-icon="custom"
      referrerPolicy="no-referrer"
      src={url}
      onError={() => {
        setFailed(true)
        onImageError?.()
      }}
    />
  )
}

export default function CategoryIcon({
  icon,
  className,
  label,
  onImageError,
}: CategoryIconProps) {
  if (icon?.kind === 'custom' && isCustomCategoryIconUrl(icon.url)) {
    return (
      <CustomImage
        key={icon.url}
        className={className}
        label={label}
        url={icon.url}
        onImageError={onImageError}
      />
    )
  }

  if (
    icon?.kind !== 'builtin' ||
    !Object.hasOwn(BUILTIN_CATEGORY_ICONS, icon.key)
  ) {
    return <FallbackIcon className={className} label={label} />
  }

  const Icon = BUILTIN_CATEGORY_ICONS[icon.key]

  return (
    <Icon
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={className}
      data-category-icon="builtin"
      role={label ? 'img' : undefined}
    />
  )
}
