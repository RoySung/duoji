import { Button, Input, Select, SelectItem, Textarea } from '@heroui/react'
import { CurrencySchema } from '@/entities/accountBook'
import {
  AccountBookFormValues,
  isAccountBookFormValid,
} from '@/utils/accountBookUtils'

type AccountBookFormProps = {
  cancelLabel?: string
  isSubmitting: boolean
  onCancel: () => void
  onSubmit: () => void
  onValuesChange: (values: AccountBookFormValues) => void
  submitLabel: string
  values: AccountBookFormValues
}

const currencyOptions = CurrencySchema.options

export default function AccountBookForm({
  cancelLabel = 'Cancel',
  isSubmitting,
  onCancel,
  onSubmit,
  onValuesChange,
  submitLabel,
  values,
}: AccountBookFormProps) {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-lg shadow-black/5">
      <div className="space-y-5">
        <Input
          isRequired
          label="Name"
          placeholder="Daily Life"
          value={values.name}
          onChange={(event) =>
            onValuesChange({
              ...values,
              name: event.target.value,
            })
          }
        />
        <Select
          label="Currency"
          selectedKeys={[values.currency]}
          onSelectionChange={(keys) => {
            const nextCurrency = Array.from(keys)[0]

            if (!nextCurrency) {
              return
            }

            onValuesChange({
              ...values,
              currency: nextCurrency as AccountBookFormValues['currency'],
            })
          }}
        >
          {currencyOptions.map((currency) => (
            <SelectItem key={currency}>{currency}</SelectItem>
          ))}
        </Select>
        <Textarea
          label="Description"
          minRows={4}
          placeholder="Shared grocery budget or personal everyday spending"
          value={values.description}
          onChange={(event) =>
            onValuesChange({
              ...values,
              description: event.target.value,
            })
          }
        />

        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="light" onPress={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            color="primary"
            disableRipple
            isDisabled={!isAccountBookFormValid(values)}
            isLoading={isSubmitting}
            onPress={onSubmit}
          >
            {submitLabel}
          </Button>
        </div>
      </div>
    </section>
  )
}
