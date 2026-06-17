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
        startContent={<PiFunnelBold size={14} />}
        endContent={
          excludedCount > 0 ? (
            <Chip size="sm" color="warning" variant="flat" className="h-5 px-2">
              {excludedCount}
            </Chip>
          ) : null
        }
        className="bg-accent/60 text-foreground"
        onPress={() => setIsOpen(true)}
      >
        {t('report.bookFilter.trigger')}
      </Button>

      <Drawer isOpen={isOpen} onOpenChange={setIsOpen} placement="right" size="sm">
        <DrawerContent>
          <DrawerHeader className="flex flex-col gap-1">
            <span>{t('report.bookFilter.title')}</span>
            <span className="text-xs font-normal text-muted-foreground">
              {t('report.bookFilter.description')}
            </span>
          </DrawerHeader>

          <DrawerBody className="gap-2 px-3 pb-4">
            <div className="flex gap-2 px-1 pb-2">
              <Button size="sm" variant="bordered" onPress={includeAll}>
                {t('report.bookFilter.includeAll')}
              </Button>
              <Button size="sm" variant="bordered" onPress={excludeAll}>
                {t('report.bookFilter.excludeAll')}
              </Button>
            </div>
            {accountBooks.map((ab) => {
              const isIncluded = !excludedBookIds.has(ab.id)
              return (
                <label
                  key={ab.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${
                    isIncluded
                      ? 'border-primary/30 bg-primary/5'
                      : 'border-border bg-card/80 hover:bg-muted/35'
                  }`}
                >
                  <Checkbox
                    isSelected={isIncluded}
                    onValueChange={() => toggle(ab.id)}
                  />
                  <span className="flex-1 truncate text-sm font-semibold text-foreground">
                    {ab.name}
                  </span>
                  <Chip
                    size="sm"
                    variant="flat"
                    className="shrink-0 bg-muted text-muted-foreground"
                  >
                    {ab.currency}
                  </Chip>
                </label>
              )
            })}
          </DrawerBody>

          <DrawerFooter>
            <Button color="primary" onPress={() => setIsOpen(false)}>
              {t('report.tagFilter.done')}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
