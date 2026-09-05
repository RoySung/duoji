import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react'
import { useTranslations } from 'next-intl'
import { useAccountBookStore } from '@/stores/accountBook'
import CategorySettingsPage from './CategorySettingsPage'
import { transactionModalClassNames } from '@/components/TransactionModal/formControlStyles'

type Props = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  accountBookId: string
}

export default function CategorySettingsModal({
  isOpen,
  onOpenChange,
  accountBookId,
}: Props) {
  const t = useTranslations()
  const accountBooks = useAccountBookStore((s) => s.accountBooks)
  const accountBook = accountBooks.find((ab) => ab.id === accountBookId) ?? null

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{
        ...transactionModalClassNames,
        base: `${transactionModalClassNames.base} sm:max-w-3xl`,
        closeButton:
          'right-2 top-2 min-h-11 min-w-11 text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
      }}
      placement="bottom"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="border-b border-border px-5 py-4 pr-14 sm:px-6 sm:pr-16">
              <h2 className="break-words text-title font-semibold text-foreground">
                {accountBook
                  ? t('categorySettings.titleWithAccountBook', {
                      accountBookName: accountBook.name,
                    })
                  : t('categorySettings.title')}
              </h2>
            </ModalHeader>
            <ModalBody className="min-h-0 overflow-y-auto px-0 pb-[env(safe-area-inset-bottom)]">
              <CategorySettingsPage
                accountBookId={accountBookId}
                onClose={onClose}
              />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
