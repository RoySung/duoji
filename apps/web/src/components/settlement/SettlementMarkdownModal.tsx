import { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  addToast,
} from '@heroui/react'
import { useTranslations } from 'next-intl'
import { PiCopyBold, PiCheckBold } from 'react-icons/pi'
import {
  settlementModalActionClassName,
  settlementModalBodyClassName,
  settlementModalClassNames,
  settlementModalContentClassName,
  settlementModalFooterClassName,
  settlementModalHeaderClassName,
} from './settlementModalStyles'

type Props = {
  markdown: string
  sequenceNumber: number
  onClose: () => void
}

export default function SettlementMarkdownModal({
  markdown,
  sequenceNumber,
  onClose,
}: Props) {
  const t = useTranslations()
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(markdown)
      setCopied(true)
      addToast({
        title: t('settlement.markdown.copiedToast'),
        color: 'success',
      })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      addToast({
        title: t('settlement.markdown.copyFailedTitle'),
        color: 'danger',
        description: t('settlement.markdown.copyFailedDesc'),
      })
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
            {t('settlement.markdown.title', { sequenceNumber })}
          </h2>
        </ModalHeader>
        <ModalBody className={settlementModalBodyClassName}>
          <p className="max-w-[70ch] text-body leading-6 text-muted-foreground">
            {t('settlement.markdown.helper')}
          </p>
          <pre
            aria-live="polite"
            className="max-h-[min(50dvh,30rem)] whitespace-pre-wrap break-words !overflow-auto !rounded-xl !bg-secondary !p-4 font-mono text-body leading-6 !text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            tabIndex={0}
          >
            {markdown}
          </pre>
        </ModalBody>
        <ModalFooter className={settlementModalFooterClassName}>
          <Button
            className={settlementModalActionClassName}
            variant="light"
            onPress={onClose}
          >
            {t('common.close')}
          </Button>
          <Button
            className={settlementModalActionClassName}
            aria-label={
              copied
                ? t('settlement.markdown.copiedAria')
                : t('settlement.markdown.copyAria')
            }
            color="primary"
            startContent={
              copied ? <PiCheckBold size={14} /> : <PiCopyBold size={14} />
            }
            onPress={handleCopy}
          >
            {copied
              ? t('settlement.markdown.copied')
              : t('settlement.markdown.copy')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
