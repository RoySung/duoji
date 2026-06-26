import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react'
import { useTranslations } from 'next-intl'
import {
  SettlementMemberStatus,
  SettlementTransfer,
} from '@/entities/settlement'
import { SharedWalletSummary } from '@/utils/settlementUtils'
import { useUserStore } from '@/stores/user'

type Props = {
  isOpen: boolean
  memberStatuses: SettlementMemberStatus[]
  transferSuggestions: Omit<
    SettlementTransfer,
    'id' | 'actualAmount' | 'note' | 'status' | 'completedAt'
  >[]
  sharedWalletSummary?: SharedWalletSummary | null
  currency: string | null
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
  isSubmitting,
  onConfirm,
  onClose,
}: Props) {
  const t = useTranslations()
  const allUsers = useUserStore((state) => state.allUsers)
  const userMap = new Map(allUsers.map((u) => [u.id, u]))

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()} placement="bottom" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>{t('settlement.confirm.title')}</ModalHeader>
        <ModalBody>
          <div className="space-y-5">
            <section>
              <h3 className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {t('settlement.confirm.balances')}
              </h3>
              <div className="space-y-2">
                {memberStatuses.map((ms) => {
                  const name = userMap.get(ms.userId)?.name ?? ms.userId
                  const isCreditor = ms.netAmount > 0
                  const isZero = ms.netAmount === 0

                  return (
                    <div
                      key={ms.userId}
                      className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3"
                    >
                      <p className="text-sm font-medium text-foreground">
                        {name}
                      </p>
                      <p
                        className={`text-sm font-semibold ${
                          isZero
                            ? 'text-muted-foreground'
                            : isCreditor
                              ? 'text-success'
                              : 'text-danger'
                        }`}
                      >
                        {isCreditor ? '+' : isZero ? '' : '-'}
                        {Math.abs(ms.netAmount).toLocaleString()}
                        {currency ? ` ${currency}` : ''}
                      </p>
                    </div>
                  )
                })}
              </div>
            </section>

            {transferSuggestions.length > 0 && (
              <section>
                <h3 className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  {t('settlement.confirm.transfers')}
                </h3>
                <div className="space-y-2">
                  {transferSuggestions.map((t, i) => {
                    const fromName =
                      userMap.get(t.fromUserId)?.name ?? t.fromUserId
                    const toName =
                      userMap.get(t.toUserId)?.name ?? t.toUserId

                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3"
                      >
                        <p className="text-sm text-foreground">
                          {fromName} → {toName}
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {t.suggestedAmount.toLocaleString()}
                          {currency ? ` ${currency}` : ''}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {sharedWalletSummary && sharedWalletSummary.totalExpense > 0 && (
              <section>
                <h3 className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  {t('settlement.sharedWallet.title')}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3">
                    <p className="text-sm text-foreground">
                      {t('settlement.sharedWallet.total')}
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {sharedWalletSummary.totalExpense.toLocaleString()}
                      {currency ? ` ${currency}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3">
                    <p className="text-sm text-foreground">
                      {t('settlement.sharedWallet.average')}
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {sharedWalletSummary.averagePerPerson.toLocaleString()}
                      {currency ? ` ${currency}` : ''}
                    </p>
                  </div>

                  {sharedWalletSummary.borrowings.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
                        {t('settlement.sharedWallet.borrowings')}
                      </p>
                      {sharedWalletSummary.borrowings.map((b, i) => {
                        const name = userMap.get(b.userId)?.name ?? b.userId
                        return (
                          <div
                            key={i}
                            className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3"
                          >
                            <p className="text-sm text-foreground">
                              {name}
                            </p>
                            <p className="text-sm font-semibold text-danger">
                              -{b.amount.toLocaleString()}
                              {currency ? ` ${currency}` : ''}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button isDisabled={isSubmitting} onPress={onClose}>
            {t('common.cancel')}
          </Button>
          <Button
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
