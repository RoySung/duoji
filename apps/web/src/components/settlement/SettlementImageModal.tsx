import { useEffect, useRef, useState } from 'react'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react'
import { useTranslations } from 'next-intl'
import { AppButton } from '@/components/ui/AppButton'
import { generateSettlementPng } from '@/utils/settlementImagePng'
import {
  createSettlementImageReport,
  type SettlementImageSource,
} from '@/utils/settlementImageReport'
import type { SettlementRecordExportData } from '@/utils/settlementMarkdown'
import {
  settlementModalActionClassName,
  settlementModalBodyClassName,
  settlementModalClassNames,
  settlementModalContentClassName,
  settlementModalFooterClassName,
  settlementModalHeaderClassName,
  settlementModalPrimaryActionClassName,
} from './settlementModalStyles'

type Props = {
  source: SettlementImageSource
  transactions: SettlementRecordExportData['transactions']
  transactionStatus: 'loading' | 'ready' | 'error'
  onRetryTransactions?: () => void
  onClose: () => void
}

type Generation =
  | { status: 'generating' }
  | { status: 'error' }
  | { status: 'ready'; url: string; file: File }

export default function SettlementImageModal({
  source,
  transactions,
  transactionStatus,
  onRetryTransactions,
  onClose,
}: Props) {
  const t = useTranslations()
  const snapshot = useRef<ReturnType<typeof createSettlementImageReport>>(null)
  const [attempt, setAttempt] = useState(0)
  const [generation, setGeneration] = useState<Generation>({
    status: 'generating',
  })
  const [isSharing, setIsSharing] = useState(false)
  const [shareFailed, setShareFailed] = useState(false)
  const sequenceNumber =
    'sequenceNumber' in source ? source.sequenceNumber : null
  const filename =
    sequenceNumber === null
      ? 'settlement-draft.png'
      : `settlement-${sequenceNumber}.png`

  useEffect(() => {
    if (transactionStatus !== 'ready') return

    const controller = new AbortController()
    let url: string | undefined

    async function generate() {
      try {
        const report = (snapshot.current ??= createSettlementImageReport({
          ...source,
          transactions,
        }))
        const png = await generateSettlementPng(report, controller.signal)
        if (controller.signal.aborted) return
        const file = new File([png], filename, { type: 'image/png' })
        url = URL.createObjectURL(file)
        setGeneration({ status: 'ready', url, file })
      } catch {
        if (!controller.signal.aborted) setGeneration({ status: 'error' })
      }
    }

    void generate()
    return () => {
      controller.abort()
      if (url) URL.revokeObjectURL(url)
    }
  }, [attempt, filename, source, transactions, transactionStatus])

  const ready =
    transactionStatus === 'ready' && generation.status === 'ready'
      ? generation
      : null
  const shareData = ready ? { files: [ready.file] } : null
  const canShare =
    shareData !== null &&
    typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare(shareData)
  const error =
    transactionStatus === 'error'
      ? 'settlement.image.loadError'
      : transactionStatus === 'ready' && generation.status === 'error'
      ? 'settlement.image.generationError'
      : null

  function retry() {
    if (transactionStatus === 'error') {
      onRetryTransactions?.()
      return
    }
    setGeneration({ status: 'generating' })
    setAttempt((current) => current + 1)
  }

  async function shareImage() {
    if (!shareData || !canShare || isSharing) return

    setIsSharing(true)
    setShareFailed(false)
    try {
      await navigator.share(shareData)
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        setShareFailed(true)
      }
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <Modal
      isOpen
      onOpenChange={(open) => !open && onClose()}
      placement="bottom"
      scrollBehavior="inside"
      size="2xl"
      classNames={settlementModalClassNames}
    >
      <ModalContent className={settlementModalContentClassName}>
        <ModalHeader className={settlementModalHeaderClassName}>
          <h2 className="break-words text-title font-semibold leading-snug text-foreground">
            {sequenceNumber === null
              ? t('settlement.image.draftPreviewTitle')
              : t('settlement.image.title', { sequenceNumber })}
          </h2>
        </ModalHeader>
        <ModalBody className={settlementModalBodyClassName}>
          <div className="space-y-3">
            {error ? (
              <div className="space-y-3">
                <p role="alert">{t(error)}</p>
                <AppButton
                  appearance="flat"
                  className="min-h-11"
                  onPress={retry}
                >
                  {t('settlement.image.retry')}
                </AppButton>
              </div>
            ) : (
              !ready && (
                <p role="status">
                  {t(
                    transactionStatus === 'loading'
                      ? 'settlement.image.loading'
                      : 'settlement.image.generating'
                  )}
                </p>
              )
            )}
            {ready && (
              /* The PNG is generated in this browser and is backed by a blob URL. */
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={
                  sequenceNumber === null
                    ? t('settlement.image.draftPreviewAlt')
                    : t('settlement.image.previewAlt', { sequenceNumber })
                }
                className="mx-auto block w-full max-w-md rounded-xl ring-1 ring-inset ring-border"
                src={ready.url}
              />
            )}
          </div>
        </ModalBody>
        <ModalFooter className={settlementModalFooterClassName}>
          {ready && !canShare && (
            <p
              role="status"
              className="col-span-2 text-body text-muted-foreground"
            >
              {t('settlement.image.shareUnavailable')}
            </p>
          )}
          {ready && shareFailed && (
            <p role="alert" className="col-span-2 text-body text-danger">
              {t('settlement.image.shareFailed')}
            </p>
          )}
          <Button
            className={settlementModalActionClassName}
            variant="light"
            onPress={onClose}
          >
            {t('common.close')}
          </Button>
          <AppButton
            className={settlementModalPrimaryActionClassName}
            isDisabled={!canShare || isSharing}
            isLoading={isSharing}
            onPress={shareImage}
          >
            {t('settlement.image.share')}
          </AppButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
