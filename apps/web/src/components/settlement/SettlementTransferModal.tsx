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
import { useTranslations } from 'next-intl'
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
  const t = useTranslations()
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
        <ModalHeader>{t('settlement.transferModal.title')}</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {fromName} → {toName}
              <span className="ml-2 font-medium text-foreground">
                {t('settlement.detail.suggested', { amount: transfer.suggestedAmount.toLocaleString() + (currency ? ` ${currency}` : '') })}
              </span>
            </p>
            <Input
              isRequired
              label={`${t('settlement.transferModal.actualAmount')}${currency ? ` (${currency})` : ''}`}
              type="number"
              inputMode="decimal"
              value={actualAmount}
              onValueChange={setActualAmount}
            />
            <Input
              label={t('settlement.transferModal.noteOptional')}
              value={note}
              onValueChange={setNote}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button isDisabled={isSubmitting} onPress={onClose}>
            {t('common.cancel')}
          </Button>
          <Button
            color="primary"
            isDisabled={!isAmountValid || isSubmitting}
            isLoading={isSubmitting}
            onPress={handleConfirm}
          >
            {t('settlement.transferModal.confirm')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
