import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Switch,
} from '@heroui/react'
import { useTranslations } from 'next-intl'
import {
  SettlementMemberStatus,
  SettlementTransfer,
} from '@/entities/settlement'
import {
  PiCaretDownBold,
  PiExportBold,
  PiFileTextBold,
  PiImageBold,
} from 'react-icons/pi'
import { Transaction } from '@/entities/transaction'
import { SharedWalletSummary } from '@/utils/settlementUtils'
import type { User } from '@/entities/user'
import SettlementMarkdownModal from './SettlementMarkdownModal'
import { formatAmount } from '@/utils/amountUtils'
import { AppButton } from '@/components/ui/AppButton'
import {
  generateSettlementDraftMarkdown,
  settlementUserName,
  type SettlementDraftExportData,
} from '@/utils/settlementMarkdown'
import {
  settlementModalActionClassName,
  settlementModalBodyClassName,
  settlementModalClassNames,
  settlementModalContentClassName,
  settlementModalFooterClassName,
  settlementModalHeaderClassName,
  settlementModalPrimaryActionClassName,
} from './settlementModalStyles'

const SettlementImageModal = dynamic(() => import('./SettlementImageModal'))

type Props = {
  isOpen: boolean
  memberStatuses: SettlementMemberStatus[]
  transferSuggestions: Omit<
    SettlementTransfer,
    'id' | 'actualAmount' | 'note' | 'status' | 'completedAt'
  >[]
  sharedWalletSummary?: SharedWalletSummary | null
  transactions: Transaction[]
  users: User[]
  categoryNames: ReadonlyMap<string, string>
  currency: string | null
  autoRound?: boolean
  onAutoRoundChange?: (autoRound: boolean) => void
  isSubmitting: boolean
  reviewChanged?: boolean
  onConfirm: () => Promise<void>
  onClose: () => void
}

export default function SettlementConfirmModal({
  isOpen,
  memberStatuses,
  transferSuggestions,
  sharedWalletSummary,
  transactions,
  users,
  categoryNames,
  currency,
  autoRound: autoRoundProp,
  onAutoRoundChange,
  isSubmitting,
  reviewChanged = false,
  onConfirm,
  onClose,
}: Props) {
  const t = useTranslations()
  const [internalAutoRound, setInternalAutoRound] = useState(true)
  const [draftMarkdown, setDraftMarkdown] = useState<string | null>(null)
  const [draftImage, setDraftImage] =
    useState<SettlementDraftExportData | null>(null)
  const [exportMenuOpen, setExportMenuOpen] = useState(false)
  const exportTrigger = useRef<HTMLButtonElement>(null)
  const autoRound = autoRoundProp ?? internalAutoRound
  const previewOpen = draftMarkdown !== null || draftImage !== null
  const canExportDraft = !isSubmitting && transactions.length > 0
  const showExportMenu = isOpen && canExportDraft && exportMenuOpen

  useEffect(() => {
    if (!isOpen || !canExportDraft) setExportMenuOpen(false)
  }, [isOpen, canExportDraft])

  const handleAutoRoundChange = (val: boolean) => {
    setInternalAutoRound(val)
    onAutoRoundChange?.(val)
  }

  const userMap = new Map(users.map((user) => [user.id, user]))
  const getName = (userId: string) => settlementUserName(userId, userMap, t)

  function handleClose() {
    setExportMenuOpen(false)
    setDraftMarkdown(null)
    setDraftImage(null)
    onClose()
  }

  function openDraft(format: 'markdown' | 'image') {
    if (!canExportDraft) return

    const draft: SettlementDraftExportData = {
      exportedAt: new Date(),
      memberStatuses,
      transfers: transferSuggestions,
      sharedWalletSummary: sharedWalletSummary ?? null,
      transactions,
      currency,
      autoRound,
      userMap,
      categoryMap: categoryNames,
      t,
    }
    if (format === 'image') setDraftImage(draft)
    else setDraftMarkdown(generateSettlementDraftMarkdown(draft))
  }

  function selectDraft(format: 'markdown' | 'image') {
    // Wait for the menu to close before the preview captures its return focus.
    requestAnimationFrame(() => {
      const trigger = exportTrigger.current
      if (!trigger?.isConnected || trigger.disabled) return
      trigger.focus()
      openDraft(format)
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      placement="bottom"
      isDismissable={!isSubmitting && !previewOpen && !showExportMenu}
      isKeyboardDismissDisabled={isSubmitting || previewOpen || showExportMenu}
      hideCloseButton={isSubmitting}
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
                isDisabled={isSubmitting}
                onValueChange={handleAutoRoundChange}
                size="sm"
                aria-label={t('settlement.unsettled.autoRound')}
              />
            </div>

            {transactions.length === 0 && (
              <p className="text-body text-muted-foreground">
                {t('settlement.unsettled.emptyDescription')}
              </p>
            )}

            <section>
              <h3 className="mb-2 text-body font-semibold leading-5 text-foreground">
                {t('settlement.confirm.balances')}
              </h3>
              <div className="divide-y divide-border overflow-hidden rounded-xl bg-secondary/70">
                {memberStatuses.map((ms) => {
                  const name = getName(ms.userId)
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
                    const fromName = getName(transfer.fromUserId)
                    const toName = getName(transfer.toUserId)

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
                          const name = getName(b.userId)
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
          {reviewChanged && (
            <p
              className="col-span-2 rounded-xl bg-secondary px-3 py-2 text-body text-foreground"
              role="status"
            >
              {t('settlement.confirm.reviewChanged')}
            </p>
          )}
          <Dropdown
            disableAnimation
            isOpen={showExportMenu}
            onOpenChange={setExportMenuOpen}
            placement="top"
          >
            <DropdownTrigger>
              <Button
                ref={exportTrigger}
                className={`${settlementModalActionClassName} col-span-2`}
                variant="flat"
                isDisabled={!canExportDraft}
                startContent={<PiExportBold aria-hidden className="size-4" />}
                endContent={<PiCaretDownBold aria-hidden className="size-3" />}
              >
                {t('settlement.confirm.exportDraft')}
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label={t('settlement.confirm.exportDraft')}>
              <DropdownItem
                key="image"
                className="min-h-11"
                startContent={<PiImageBold aria-hidden className="size-4" />}
                onAction={() => selectDraft('image')}
              >
                {t('settlement.confirm.draftImage')}
              </DropdownItem>
              <DropdownItem
                key="markdown"
                className="min-h-11"
                startContent={<PiFileTextBold aria-hidden className="size-4" />}
                onAction={() => selectDraft('markdown')}
              >
                {t('settlement.confirm.draftMarkdown')}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button
            className={settlementModalActionClassName}
            isDisabled={isSubmitting}
            onPress={handleClose}
          >
            {t('common.cancel')}
          </Button>
          <AppButton
            className={`${settlementModalPrimaryActionClassName} h-auto whitespace-normal py-2`}
            isDisabled={isSubmitting || transactions.length === 0}
            isLoading={isSubmitting}
            onPress={onConfirm}
          >
            {t('settlement.confirm.submit')}
          </AppButton>
        </ModalFooter>
        {draftMarkdown !== null && (
          <SettlementMarkdownModal
            markdown={draftMarkdown}
            title={t('settlement.markdown.draft.previewTitle')}
            onClose={() => setDraftMarkdown(null)}
          />
        )}
        {draftImage && (
          <SettlementImageModal
            source={draftImage}
            transactions={draftImage.transactions}
            transactionStatus="ready"
            onClose={() => setDraftImage(null)}
          />
        )}
      </ModalContent>
    </Modal>
  )
}
