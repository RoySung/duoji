import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react'
import { useTranslations } from 'next-intl'
import { confirmModalClassNames } from '@/components/TransactionModal/formControlStyles'
import { AppButton } from '@/components/ui/AppButton'

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
      classNames={confirmModalClassNames}
      disableAnimation
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      placement="center"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>
          <h2 className="text-title font-semibold text-foreground">
            {t('accountBook.deleteModal.title')}
          </h2>
        </ModalHeader>
        <ModalBody>
          <p className="break-words text-body text-muted-foreground text-pretty">
            {t('accountBook.deleteModal.bodyPrefix')}
            <span className="font-semibold text-foreground">
              {accountBookName}
            </span>
            {t('accountBook.deleteModal.bodySuffix')}
          </p>
        </ModalBody>
        <ModalFooter>
          <AppButton
            className="min-h-11 rounded-xl text-body"
            appearance="light"
            tone="neutral"
            onPress={onClose}
          >
            {t('common.cancel')}
          </AppButton>
          <AppButton
            className="min-h-11 rounded-xl text-body"
            tone="danger"
            disableRipple
            isLoading={isSubmitting}
            onPress={() => void onConfirm()}
          >
            {t('accountBook.deleteModal.confirm')}
          </AppButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
