import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react'
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
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Delete Category</ModalHeader>

        <ModalBody className="flex flex-col gap-3">
          <p className="text-sm text-foreground">
            Are you sure you want to delete{' '}
            <span className="font-semibold">{categoryName}</span>?
          </p>

          {subCount > 0 && (
            <div className="flex items-start gap-2 rounded-xl bg-danger/10 px-3 py-2 text-danger">
              <PiWarningDuotone className="mt-0.5 flex-shrink-0 text-base" />
              <p className="text-xs">
                This will also delete{' '}
                <span className="font-semibold">{subCount}</span> sub-category
              </p>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button disableRipple variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button color="danger" disableRipple onPress={onConfirm}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
