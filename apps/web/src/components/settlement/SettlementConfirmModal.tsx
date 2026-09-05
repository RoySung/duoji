import { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Switch,
} from '@heroui/react'
import { useTranslations } from 'next-intl'
import {
  SettlementMemberStatus,
  SettlementTransfer,
} from '@/entities/settlement'
import { SharedWalletSummary } from '@/utils/settlementUtils'
import { useUserStore } from '@/stores/user'
import { formatAmount } from '@/utils/amountUtils'
import {
  settlementModalActionClassName,
  settlementModalBodyClassName,
  settlementModalClassNames,
  settlementModalContentClassName,
  settlementModalFooterClassName,
  settlementModalHeaderClassName,
} from './settlementModalStyles'

type Props = {
  isOpen: boolean
  memberStatuses: SettlementMemberStatus[]
  transferSuggestions: Omit<
    SettlementTransfer,
    'id' | 'actualAmount' | 'note' | 'status' | 'completedAt'
  >[]
  sharedWalletSummary?: SharedWalletSummary | null
  currency: string | null
  autoRound?: boolean
  onAutoRoundChange?: (autoRound: boolean) => void
  isSubmitting: boolean
  onConfirm: () => Promise<void>
  onClose: () => void
}

export default function SettlementConfirmModal({
  isOpen,
  memberStatuses,
  transferSuggestions,
  sharedWalletSummary,
  currency,
  autoRound: autoRoundProp,
  onAutoRoundChange,
  isSubmitting,
  onConfirm,
  onClose,
}: Props) {
  const t = useTranslations()
  const [internalAutoRound, setInternalAutoRound] = useState(true)
  const autoRound = autoRoundProp ?? internalAutoRound

  const handleAutoRoundChange = (val: boolean) => {
    setInternalAutoRound(val)
    onAutoRoundChange?.(val)
  }

  const allUsers = useUserStore((state) => state.allUsers)
  const userMap = new Map(allUsers.map((u) => [u.id, u]))

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      placement="bottom"
      scrollBehavior="inside"
      classNames={settlementModalClassNames}
    >
      <ModalContent className={settlementModalContentClassName}>
        <ModalHeader className={settlementModalHeaderClassName}>
          <h2 className="text-title font-semibold leading-snug text-foreground">
            {t('settlement.confirm.title')}
          </h2>
        </ModalHeader>
        <ModalBody className={settlementModalBodyClassName}>
          <div className="space-y-5">
            <div className="flex min-h-14 items-center justify-between gap-4 rounded-xl bg-secondary px-4 py-2">
              <span className="min-w-0 text-body font-medium leading-5 text-foreground">
                {t('settlement.unsettled.autoRound')}
              </span>
              <Switch
                className="min-h-11 min-w-11 shrink-0 justify-end"
                isSelected={autoRound}
                onValueChange={handleAutoRoundChange}
                size="sm"
                aria-label={t('settlement.unsettled.autoRound')}
              />
            </div>

            <section>
              <h3 className="mb-2 text-body font-semibold leading-5 text-foreground">
                {t('settlement.confirm.balances')}
              </h3>
              <div className="divide-y divide-border overflow-hidden rounded-xl bg-secondary/70">
                {memberStatuses.map((ms) => {
                  const name = userMap.get(ms.userId)?.name ?? ms.userId
                  const isCreditor = ms.netAmount > 0
                  const isZero = ms.netAmount === 0

                  return (
                    <div
                      key={ms.userId}
                      className="grid min-h-11 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3"
                    >
                      <p className="min-w-0 break-words text-body font-medium leading-5 text-foreground">
                        {name}
                      </p>
                      <p
                        className={`max-w-[48vw] break-words text-right text-body font-semibold leading-5 tabular-nums sm:max-w-none ${
                          isZero
                            ? 'text-muted-foreground'
                            : isCreditor
                            ? 'text-success'
                            : 'text-danger'
                        }`}
                      >
                        {isCreditor ? '+' : isZero ? '' : '-'}
                        {formatAmount(Math.abs(ms.netAmount), currency, {
                          roundMode: autoRound ? 'ceil' : 'none',
                        })}
                      </p>
                    </div>
                  )
                })}
              </div>
            </section>

            {transferSuggestions.length > 0 && (
              <section>
                <h3 className="mb-2 text-body font-semibold leading-5 text-foreground">
                  {t('settlement.confirm.transfers')}
                </h3>
                <div className="divide-y divide-border overflow-hidden rounded-xl bg-secondary/70">
                  {transferSuggestions.map((transfer, i) => {
                    const fromName =
                      userMap.get(transfer.fromUserId)?.name ??
                      transfer.fromUserId
                    const toName =
                      userMap.get(transfer.toUserId)?.name ?? transfer.toUserId

                    return (
                      <div
                        key={i}
                        className="grid min-h-11 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3"
                      >
                        <p className="min-w-0 break-words text-body leading-5 text-foreground">
                          {fromName} → {toName}
                        </p>
                        <p className="max-w-[48vw] break-words text-right text-body font-semibold leading-5 text-foreground tabular-nums sm:max-w-none">
                          {formatAmount(transfer.suggestedAmount, currency, {
                            roundMode: autoRound ? 'ceil' : 'none',
                          })}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {sharedWalletSummary && sharedWalletSummary.totalExpense > 0 && (
              <section>
                <h3 className="mb-2 text-body font-semibold leading-5 text-foreground">
                  {t('settlement.sharedWallet.title')}
                </h3>
                <div className="divide-y divide-border overflow-hidden rounded-xl bg-secondary/70">
                  <div className="grid min-h-11 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
                    <p className="min-w-0 break-words text-body leading-5 text-foreground">
                      {t('settlement.sharedWallet.total')}
                    </p>
                    <p className="text-right text-body font-semibold leading-5 text-foreground tabular-nums">
                      {formatAmount(sharedWalletSummary.totalExpense, currency)}
                    </p>
                  </div>
                  <div className="grid min-h-11 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
                    <p className="min-w-0 break-words text-body leading-5 text-foreground">
                      {t('settlement.sharedWallet.average')}
                    </p>
                    <p className="text-right text-body font-semibold leading-5 text-foreground tabular-nums">
                      {formatAmount(
                        sharedWalletSummary.averagePerPerson,
                        currency,
                        {
                          roundMode: autoRound ? 'ceil' : 'none',
                        }
                      )}
                    </p>
                  </div>

                  {sharedWalletSummary.borrowings.length > 0 && (
                    <div className="border-t border-border">
                      <p className="px-4 pb-2 pt-3 text-label font-medium leading-5 text-muted-foreground">
                        {t('settlement.sharedWallet.borrowings')}
                      </p>
                      <div>
                        {sharedWalletSummary.borrowings.map((b, i) => {
                          const name = userMap.get(b.userId)?.name ?? b.userId
                          return (
                            <div
                              key={i}
                              className="grid min-h-11 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-border px-4 py-2"
                            >
                              <p className="min-w-0 break-words text-body leading-5 text-foreground">
                                {name}
                              </p>
                              <p className="text-right text-body font-semibold leading-5 text-danger tabular-nums">
                                -
                                {formatAmount(b.amount, currency, {
                                  roundMode: autoRound ? 'ceil' : 'none',
                                })}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}
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
            isDisabled={isSubmitting}
            isLoading={isSubmitting}
            onPress={onConfirm}
          >
            {t('settlement.confirm.submit')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
