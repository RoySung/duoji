import { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from '@heroui/react'
import { SettlementTransfer } from '@/entities/settlement'
import { useUserStore } from '@/stores/user'

type Props = {
  transfer: SettlementTransfer
  currency: string | null
  onConfirm: (actualAmount: number, note: string) => Promise<void>
  onClose: () => void
}

export default function SettlementTransferModal({
  transfer,
  currency,
  onConfirm,
  onClose,
}: Props) {
  const [actualAmount, setActualAmount] = useState(
    transfer.suggestedAmount.toString()
  )
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const allUsers = useUserStore((state) => state.allUsers)
  const userMap = new Map(allUsers.map((u) => [u.id, u]))

  const fromName = userMap.get(transfer.fromUserId)?.name ?? transfer.fromUserId
  const toName = userMap.get(transfer.toUserId)?.name ?? transfer.toUserId
  const parsedAmount = parseFloat(actualAmount)
  const isAmountValid = !isNaN(parsedAmount) && parsedAmount > 0

  async function handleConfirm() {
    if (!isAmountValid) return
    setIsSubmitting(true)
    try {
      await onConfirm(parsedAmount, note)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen onOpenChange={(open) => !open && onClose()} placement="bottom">
      <ModalContent>
        <ModalHeader>Mark transfer done</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {fromName} → {toName}
              <span className="ml-2 font-medium text-foreground">
                Suggested: {transfer.suggestedAmount.toLocaleString()}
                {currency ? ` ${currency}` : ''}
              </span>
            </p>
            <Input
              isRequired
              label={`Actual amount${currency ? ` (${currency})` : ''}`}
              type="number"
              value={actualAmount}
              onValueChange={setActualAmount}
            />
            <Input
              label="Note (optional)"
              value={note}
              onValueChange={setNote}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button isDisabled={isSubmitting} onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            isDisabled={!isAmountValid || isSubmitting}
            isLoading={isSubmitting}
            onPress={handleConfirm}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
