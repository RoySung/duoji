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
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(markdown)
      setCopied(true)
      addToast({ title: 'Copied to clipboard', color: 'success' })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      addToast({
        title: 'Copy failed',
        color: 'danger',
        description: 'Please select and copy the text manually.',
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
        <ModalHeader>Export as Markdown — Settlement #{sequenceNumber}</ModalHeader>
        <ModalBody>
          <p className="text-xs text-muted-foreground">
            Paste into Notion, Obsidian, or any markdown-compatible app.
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
            Close
          </Button>
          <Button
            aria-label={copied ? 'Markdown copied to clipboard' : 'Copy markdown'}
            color="primary"
            startContent={copied ? <PiCheckBold /> : <PiCopyBold />}
            onPress={handleCopy}
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
