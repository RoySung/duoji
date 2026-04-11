import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react'
import { useAccountBookStore } from '@/stores/accountBook'
import CategorySettingsPage from './CategorySettingsPage'

type Props = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  accountBookId: string
}

export default function CategorySettingsModal({ isOpen, onOpenChange, accountBookId }: Props) {
  const accountBooks = useAccountBookStore((s) => s.accountBooks)
  const accountBook = accountBooks.find((ab) => ab.id === accountBookId) ?? null

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl" scrollBehavior="inside">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              {accountBook ? `${accountBook.name} — Categories` : 'Categories'}
            </ModalHeader>
            <ModalBody className="px-4 pb-4">
              <CategorySettingsPage accountBookId={accountBookId} onClose={onClose} />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
