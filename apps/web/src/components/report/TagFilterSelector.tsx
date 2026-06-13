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
          startContent={<PiFunnelBold size={14} />}
          endContent={
            selectedCount > 0 ? (
              <Chip size="sm" color="warning" variant="flat" className="h-5 px-2">
                {selectedCount}
              </Chip>
            ) : null
          }
          className="bg-accent/60 text-foreground"
        >
          {t('report.tagFilter.trigger')}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[min(23rem,calc(100vw-1rem))] rounded-[1.35rem] border border-border/80 bg-card p-0 shadow-[0_18px_44px_-30px_rgba(15,23,42,0.24)]">
        <div className="flex w-full max-h-[min(24rem,calc(100vh-4.5rem))] flex-col overflow-hidden">
          <div className="w-full border-b border-border/60 px-4 pb-3 pt-4 sm:px-5 text-left">
            <span className="text-[15px] font-semibold text-foreground">
              {t('report.tagFilter.title')}
            </span>
          </div>

          <div className="w-full flex flex-wrap items-center justify-start gap-1.5 overflow-y-auto px-4 py-3 sm:px-5">
            {allTags.length === 0 ? (
              <div className="w-full rounded-[1.25rem] border border-dashed border-border px-4 py-5 text-sm leading-6 text-muted-foreground text-left">
                {t('report.tagFilter.empty')}
              </div>
            ) : (
              allTags.map((tag) => {
                const isSelected = selectedTags.has(tag)
                return (
                  <label
                    key={tag}
                    className={clsx(
                      'flex min-h-9 w-fit cursor-pointer items-center gap-2 rounded-[1rem] border px-2.5 py-1.5 transition-colors',
                      isSelected
                        ? 'border-primary/30 bg-primary/10 text-foreground'
                        : 'border-border/70 bg-background text-foreground hover:border-primary/20 hover:bg-muted/30'
                    )}
                  >
                    <Checkbox
                      isSelected={isSelected}
                      onValueChange={() => toggle(tag)}
                    />
                    <span className="truncate text-[12px] font-medium text-left leading-4">
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