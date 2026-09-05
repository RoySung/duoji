import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react'
import { useTranslations } from 'next-intl'
import { PiWarningDuotone } from 'react-icons/pi'
import { confirmModalClassNames } from '@/components/TransactionModal/formControlStyles'
import { AppButton } from '@/components/ui/AppButton'

type DeleteConfirmModalProps = {
  isOpen: boolean
  categoryName: string
  subCount: number
  onConfirm: () => void
  onClose: () => void
}

export default function DeleteConfirmModal({
  isOpen,
  categoryName,
  subCount,
  onConfirm,
  onClose,
}: DeleteConfirmModalProps) {
  const t = useTranslations()

  return (
    <Modal
      classNames={confirmModalClassNames}
      isOpen={isOpen}
      placement="center"
      scrollBehavior="inside"
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader>
          <h2 className="text-title font-semibold text-foreground">
            {t('categorySettings.deleteModal.title')}
          </h2>
        </ModalHeader>

        <ModalBody className="flex flex-col gap-3">
          <p className="break-words text-body text-foreground">
            {t('categorySettings.deleteModal.confirmPrefix')}
            <span className="font-semibold">{categoryName}</span>
            {t('categorySettings.deleteModal.confirmSuffix')}
          </p>

          {subCount > 0 ? (
            <div className="flex items-start gap-2 rounded-xl bg-danger/10 px-3 py-3 text-danger ring-1 ring-inset ring-danger/20">
              <PiWarningDuotone className="mt-0.5 flex-shrink-0" size={14} />
              <p className="break-words text-label leading-5">
                {t('categorySettings.deleteModal.subAlsoPrefix')}
                <span className="font-semibold">{subCount}</span>
                {t('categorySettings.deleteModal.subAlsoSuffix')}
              </p>
            </div>
          ) : null}
        </ModalBody>

        <ModalFooter>
          <AppButton
            className="min-h-11 rounded-xl text-body"
            disableRipple
            appearance="flat"
            tone="neutral"
            onPress={onClose}
          >
            {t('common.cancel')}
          </AppButton>
          <AppButton
            className="min-h-11 rounded-xl text-body"
            tone="danger"
            disableRipple
            onPress={onConfirm}
          >
            {t('common.delete')}
          </AppButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
