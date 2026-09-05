import { useState } from 'react'
import {
  Button,
  Checkbox,
  Chip,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from '@heroui/react'
import { useTranslations } from 'next-intl'
import { PiFunnelBold } from 'react-icons/pi'
import { AccountBook } from '@/entities/accountBook'

type Props = {
  accountBooks: AccountBook[]
  excludedBookIds: Set<string>
  onChange: (excluded: Set<string>) => void
}

export default function BookFilterSelector({
  accountBooks,
  excludedBookIds,
  onChange,
}: Props) {
  const t = useTranslations()
  const [isOpen, setIsOpen] = useState(false)
  const excludedCount = excludedBookIds.size

  function toggle(id: string) {
    const next = new Set(excludedBookIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    onChange(next)
  }

  function includeAll() {
    onChange(new Set())
  }

  function excludeAll() {
    onChange(new Set(accountBooks.map((ab) => ab.id)))
  }

  return (
    <>
      <Button
        variant="flat"
        size="sm"
        startContent={<PiFunnelBold size={12} />}
        endContent={
          excludedCount > 0 ? (
            <Chip
              size="sm"
              color="warning"
              variant="flat"
              className="h-5 bg-emphasis/15 px-2 text-label text-emphasis-foreground"
            >
              {excludedCount}
            </Chip>
          ) : null
        }
        className="min-h-11 rounded-xl bg-secondary px-3 text-body text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-2 focus-visible:ring-ring"
        onPress={() => setIsOpen(true)}
      >
        {t('report.bookFilter.trigger')}
      </Button>

      <Drawer
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        placement="right"
        size="sm"
      >
        <DrawerContent className="bg-card text-card-foreground">
          <DrawerHeader className="flex flex-col gap-1 text-title font-semibold">
            <span className="text-balance">{t('report.bookFilter.title')}</span>
            <span className="max-w-[65ch] text-body font-normal text-muted-foreground text-pretty">
              {t('report.bookFilter.description')}
            </span>
          </DrawerHeader>

          <DrawerBody className="gap-2 px-3 pb-4 sm:px-4">
            <div className="flex flex-wrap gap-2 pb-2">
              <Button
                size="sm"
                variant="bordered"
                onPress={includeAll}
                className="min-h-11 rounded-xl border-border text-body text-foreground"
              >
                {t('report.bookFilter.includeAll')}
              </Button>
              <Button
                size="sm"
                variant="bordered"
                onPress={excludeAll}
                className="min-h-11 rounded-xl border-border text-body text-foreground"
              >
                {t('report.bookFilter.excludeAll')}
              </Button>
            </div>
            {accountBooks.map((ab) => {
              const isIncluded = !excludedBookIds.has(ab.id)
              return (
                <label
                  key={ab.id}
                  className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${
                    isIncluded
                      ? 'border-primary/40 bg-primary/10'
                      : 'border-border bg-background hover:bg-muted'
                  }`}
                >
                  <Checkbox
                    isSelected={isIncluded}
                    onValueChange={() => toggle(ab.id)}
                  />
                  <span className="flex-1 truncate text-body font-semibold text-foreground">
                    {ab.name}
                  </span>
                  <Chip
                    size="sm"
                    variant="flat"
                    className="shrink-0 bg-secondary text-label text-secondary-foreground"
                  >
                    {ab.currency}
                  </Chip>
                </label>
              )
            })}
          </DrawerBody>

          <DrawerFooter>
            <Button
              color="primary"
              onPress={() => setIsOpen(false)}
              className="min-h-11 rounded-xl text-body"
            >
              {t('report.tagFilter.done')}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
