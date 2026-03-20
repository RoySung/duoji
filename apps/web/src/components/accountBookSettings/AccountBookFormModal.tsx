import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from '@heroui/react'
import { useEffect, useState } from 'react'
import { CurrencySchema } from '@/entities/accountBook'
import {
  AccountBookFormValues,
  defaultAccountBookFormValues,
  isAccountBookFormValid,
} from '@/utils/accountBookUtils'

type AccountBookFormModalProps = {
  isOpen: boolean
  mode: 'create' | 'edit'
  initialValues?: AccountBookFormValues
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (values: AccountBookFormValues) => Promise<void> | void
}

const currencyOptions = CurrencySchema.options

export default function AccountBookFormModal({
  isOpen,
  mode,
  initialValues = defaultAccountBookFormValues,
  isSubmitting,
  onClose,
  onSubmit,
}: AccountBookFormModalProps) {
  const [formValues, setFormValues] =
    useState<AccountBookFormValues>(initialValues)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setFormValues(initialValues)
  }, [initialValues, isOpen])

  async function handleSubmit() {
    if (!isAccountBookFormValid(formValues)) {
      return
    }

    await onSubmit(formValues)
  }

  return (
    <Modal
      disableAnimation
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <span>
            {mode === 'create' ? 'Create account book' : 'Edit account book'}
          </span>
          <span className="text-sm font-normal text-zinc-400">
            Update the personal account book details used across local views.
          </span>
        </ModalHeader>
        <ModalBody>
          <Input
            isRequired
            label="Name"
            placeholder="Daily Life"
            value={formValues.name}
            onChange={(event) =>
              setFormValues((currentValues) => ({
                ...currentValues,
                name: event.target.value,
              }))
            }
          />
          <Select
            label="Currency"
            selectedKeys={[formValues.currency]}
            onSelectionChange={(keys) => {
              const nextCurrency = Array.from(keys)[0]

              if (!nextCurrency) {
                return
              }

              setFormValues((currentValues) => ({
                ...currentValues,
                currency: nextCurrency as AccountBookFormValues['currency'],
              }))
            }}
          >
            {currencyOptions.map((currency) => (
              <SelectItem key={currency}>{currency}</SelectItem>
            ))}
          </Select>
          <Textarea
            label="Description"
            minRows={3}
            placeholder="Shared grocery budget or personal everyday spending"
            value={formValues.description}
            onChange={(event) =>
              setFormValues((currentValues) => ({
                ...currentValues,
                description: event.target.value,
              }))
            }
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            disableRipple
            isDisabled={!isAccountBookFormValid(formValues)}
            isLoading={isSubmitting}
            onPress={() => void handleSubmit()}
          >
            {mode === 'create' ? 'Create' : 'Save'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
