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
import { formatAmount } from '@/utils/amountUtils'
import { compactInputClassNames } from '@/components/TransactionModal/formControlStyles'
import {
  settlementFormModalClassNames,
  settlementModalActionClassName,
  settlementModalBodyClassName,
  settlementModalContentClassName,
  settlementModalFooterClassName,
  settlementModalHeaderClassName,
} from './settlementModalStyles'

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
    <Modal
      isOpen
      onOpenChange={(open) => !open && onClose()}
      placement="bottom"
      scrollBehavior="inside"
      classNames={settlementFormModalClassNames}
    >
      <ModalContent className={settlementModalContentClassName}>
        <ModalHeader className={settlementModalHeaderClassName}>
          <h2 className="text-title font-semibold leading-snug text-foreground">
            {t('settlement.transferModal.title')}
          </h2>
        </ModalHeader>
        <ModalBody className={settlementModalBodyClassName}>
          <div className="space-y-4">
            <div className="rounded-xl bg-secondary px-4 py-3">
              <p className="break-words text-body font-medium leading-5 text-foreground">
                {fromName} → {toName}
              </p>
              <p className="mt-1 break-words text-body leading-5 text-muted-foreground tabular-nums">
                {t('settlement.detail.suggested', {
                  amount: formatAmount(transfer.suggestedAmount, currency),
                })}
              </p>
            </div>
            <Input
              classNames={compactInputClassNames}
              isRequired
              label={`${t('settlement.transferModal.actualAmount')}${
                currency ? ` (${currency})` : ''
              }`}
              type="number"
              inputMode="decimal"
              value={actualAmount}
              onValueChange={setActualAmount}
            />
            <Input
              classNames={compactInputClassNames}
              label={t('settlement.transferModal.noteOptional')}
              value={note}
              onValueChange={setNote}
            />
          </div>
        </ModalBody>
        <ModalFooter className={settlementModalFooterClassName}>
          <Button
            className={settlementModalActionClassName}
            isDisabled={isSubmitting}
            onPress={onClose}
          >
            {t('common.cancel')}
          </Button>
          <Button
            className={settlementModalActionClassName}
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
