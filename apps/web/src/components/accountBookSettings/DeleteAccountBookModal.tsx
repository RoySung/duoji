import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react'

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
  return (
    <Modal
      disableAnimation
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <ModalContent>
        <ModalHeader>Delete account book</ModalHeader>
        <ModalBody>
          <p className="text-sm text-zinc-500">
            Delete{' '}
            <span className="font-semibold text-zinc-900">
              {accountBookName}
            </span>
            ? The current account book will fall back to another available
            account book when possible.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="danger"
            disableRipple
            isLoading={isSubmitting}
            onPress={() => void onConfirm()}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
