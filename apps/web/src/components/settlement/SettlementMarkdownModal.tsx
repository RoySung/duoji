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
      addToast({ title: t('settlement.markdown.copiedToast'), color: 'success' })
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
    >
      <ModalContent>
        <ModalHeader>{t('settlement.markdown.title', { sequenceNumber })}</ModalHeader>
        <ModalBody>
          <p className="text-xs text-muted-foreground">
            {t('settlement.markdown.helper')}
          </p>
          <pre
            aria-live="polite"
            className="whitespace-pre-wrap break-words rounded-xl bg-content2 p-4 font-mono text-sm text-foreground"
          >
            {markdown}
          </pre>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            {t('common.close')}
          </Button>
          <Button
            aria-label={copied ? t('settlement.markdown.copiedAria') : t('settlement.markdown.copyAria')}
            color="primary"
            startContent={copied ? <PiCheckBold /> : <PiCopyBold />}
            onPress={handleCopy}
          >
            {copied ? t('settlement.markdown.copied') : t('settlement.markdown.copy')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
