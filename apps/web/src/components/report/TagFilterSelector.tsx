import { useState } from 'react'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import {
  Button,
  Checkbox,
  Chip,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@heroui/react'
import { PiFunnelBold } from 'react-icons/pi'

type Props = {
  allTags: string[]
  selectedTags: Set<string>
  onChange: (selected: Set<string>) => void
}

export default function TagFilterSelector({
  allTags,
  selectedTags,
  onChange,
}: Props) {
  const t = useTranslations()
  const [isOpen, setIsOpen] = useState(false)
  const selectedCount = selectedTags.size

  function toggle(tag: string) {
    const next = new Set(selectedTags)
    if (next.has(tag)) {
      next.delete(tag)
    } else {
      next.add(tag)
    }
    onChange(next)
  }

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      placement="bottom-end"
      offset={10}
      showArrow
    >
      <PopoverTrigger>
        <Button
          variant="flat"
          size="sm"
          startContent={<PiFunnelBold size={12} />}
          endContent={
            selectedCount > 0 ? (
              <Chip
                size="sm"
                color="warning"
                variant="flat"
                className="h-5 bg-emphasis/15 px-2 text-label text-emphasis-foreground"
              >
                {selectedCount}
              </Chip>
            ) : null
          }
          className="min-h-11 rounded-xl bg-secondary px-3 text-body text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-2 focus-visible:ring-ring"
        >
          {t('report.tagFilter.trigger')}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[min(23rem,calc(100vw-1rem))] rounded-2xl bg-popover p-0 text-popover-foreground shadow-[0_8px_24px_rgba(20,31,29,0.18)]">
        <div className="flex max-h-[min(24rem,calc(100vh-4.5rem))] w-full flex-col overflow-hidden">
          <div className="w-full border-b border-border px-4 pb-3 pt-4 text-left sm:px-5">
            <span className="text-title font-semibold text-foreground">
              {t('report.tagFilter.title')}
            </span>
          </div>

          <div className="flex w-full flex-wrap items-center justify-start gap-2 overflow-y-auto px-4 py-3 sm:px-5">
            {allTags.length === 0 ? (
              <div className="w-full rounded-2xl bg-muted px-4 py-5 text-left text-body leading-6 text-muted-foreground">
                {t('report.tagFilter.empty')}
              </div>
            ) : (
              allTags.map((tag) => {
                const isSelected = selectedTags.has(tag)
                return (
                  <label
                    key={tag}
                    className={clsx(
                      'flex min-h-11 max-w-full cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 transition-colors focus-within:ring-2 focus-within:ring-ring',
                      isSelected
                        ? 'border-primary/40 bg-primary/10 text-foreground'
                        : 'border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted'
                    )}
                  >
                    <Checkbox
                      isSelected={isSelected}
                      onValueChange={() => toggle(tag)}
                    />
                    <span className="max-w-[15rem] truncate text-left text-body font-medium leading-5">
                      {tag}
                    </span>
                  </label>
                )
              })
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
