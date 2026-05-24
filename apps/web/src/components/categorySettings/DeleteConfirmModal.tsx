import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react'
import { useTranslations } from 'next-intl'
import { PiWarningDuotone } from 'react-icons/pi'

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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>{t('categorySettings.deleteModal.title')}</ModalHeader>

        <ModalBody className="flex flex-col gap-3">
          <p className="text-sm text-foreground">
            {t('categorySettings.deleteModal.confirmPrefix')}
            <span className="font-semibold">{categoryName}</span>
            {t('categorySettings.deleteModal.confirmSuffix')}
          </p>

          {subCount > 0 && (
            <div className="flex items-start gap-2 rounded-xl bg-danger/10 px-3 py-2 text-danger">
              <PiWarningDuotone className="mt-0.5 flex-shrink-0 text-base" />
              <p className="text-xs">
                {t('categorySettings.deleteModal.subAlsoPrefix')}
                <span className="font-semibold">{subCount}</span>
                {t('categorySettings.deleteModal.subAlsoSuffix')}
              </p>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button disableRipple variant="flat" onPress={onClose}>
            {t('common.cancel')}
          </Button>
          <Button color="danger" disableRipple onPress={onConfirm}>
            {t('common.delete')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
