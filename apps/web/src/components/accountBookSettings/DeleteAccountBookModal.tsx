import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react'
import { useTranslations } from 'next-intl'

type DeleteAccountBookModalProps = {
  accountBookName: string
  isOpen: boolean
  isSubmitting: boolean
  onClose: () => void
  onConfirm: () => Promise<void> | void
}

export default function DeleteAccountBookModal({
  accountBookName,
  isOpen,
  isSubmitting,
  onClose,
  onConfirm,
}: DeleteAccountBookModalProps) {
  const t = useTranslations()

  return (
    <Modal
      disableAnimation
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <ModalContent>
        <ModalHeader>{t('accountBook.deleteModal.title')}</ModalHeader>
        <ModalBody>
          <p className="text-sm text-zinc-500">
            {t('accountBook.deleteModal.bodyPrefix')}
            <span className="font-semibold text-zinc-900">
              {accountBookName}
            </span>
            {t('accountBook.deleteModal.bodySuffix')}
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            {t('common.cancel')}
          </Button>
          <Button
            color="danger"
            disableRipple
            isLoading={isSubmitting}
            onPress={() => void onConfirm()}
          >
            {t('accountBook.deleteModal.confirm')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
