import { useRouter } from 'next/router'
import {
  Button,
  Chip,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from '@heroui/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { PiBooksBold, PiCaretDownBold, PiPlusCircleDuotone } from 'react-icons/pi'
import { AccountBook } from '@/entities/accountBook'

type Props = {
  accountBooks: AccountBook[]
  currentAccountBook: AccountBook | null
}

export default function AccountBookMenu({ accountBooks, currentAccountBook }: Props) {
  const t = useTranslations()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const isAllBooksView =
    typeof router.query.id === 'string' && router.query.id === 'all'

  function handleSelect(id: string) {
    void router.push(`/account-books/${id}`)
    setIsOpen(false)
  }

  function handleEdit(id: string) {
    void router.push(`/account-books/${id}/settings`)
    setIsOpen(false)
  }

  function handleCreate() {
    void router.push('/account-books/new')
    setIsOpen(false)
  }

  return (
    <>
      <Button
        variant="flat"
        size="sm"
        startContent={<PiBooksBold size={15} />}
        endContent={<PiCaretDownBold size={12} />}
        className="bg-accent/60 text-foreground"
        onPress={() => setIsOpen(true)}
      >
        {isAllBooksView
          ? t('accountBook.menu.allBooks')
          : (currentAccountBook?.name ?? t('accountBook.menu.selectPlaceholder'))}
      </Button>

      <Drawer isOpen={isOpen} onOpenChange={setIsOpen} placement="right" size="sm">
        <DrawerContent>
          <DrawerHeader className="flex flex-col gap-1">{t('accountBook.menu.drawerTitle')}</DrawerHeader>

          <DrawerBody className="gap-2 px-3 pb-4">
            <article
              className={`flex flex-col gap-3 rounded-2xl border px-4 py-4 transition-colors ${
                isAllBooksView
                  ? 'border-primary/30 bg-primary/5'
                  : 'cursor-pointer border-border bg-card/80 hover:bg-muted/35'
              }`}
              onClick={isAllBooksView ? undefined : () => handleSelect('accountBook.menu.all')}
            >
              <div className="flex items-center gap-2">
                <span className="flex-1 truncate text-sm font-semibold text-foreground">
                  {t('accountBook.menu.allBooks')}
                </span>
              </div>
              <p className="text-xs leading-5 text-muted-foreground">
                {t('accountBook.menu.allBooksDescription')}
              </p>
              <p className="text-xs leading-5 text-muted-foreground/60">
                {t('accountBook.menu.allBooksHint')}
              </p>
            </article>
            {accountBooks.map((ab) => {
              const isActive = ab.id === currentAccountBook?.id

              return (
                <article
                  key={ab.id}
                  className={`flex flex-col gap-3 rounded-2xl border px-4 py-4 transition-colors ${
                    isActive
                      ? 'border-primary/30 bg-primary/5'
                      : 'cursor-pointer border-border bg-card/80 hover:bg-muted/35'
                  }`}
                  onClick={isActive ? undefined : () => handleSelect(ab.id)}
                >
                  <div className="flex items-center gap-2">
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
                  </div>
                  {ab.description ? (
                    <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
                      {ab.description}
                    </p>
                  ) : null}
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      color="default"
                      variant="bordered"
                      onPress={() => handleEdit(ab.id)}
                    >
                      {t('accountBook.menu.edit')}
                    </Button>
                  </div>
                </article>
              )
            })}
            <button
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/40 py-3 text-sm font-semibold text-primary/70 transition hover:border-primary/60 hover:bg-primary/5"
              type="button"
              onClick={handleCreate}
            >
              <PiPlusCircleDuotone className="text-base" /> {t('accountBook.menu.newAccountBook')}
            </button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
