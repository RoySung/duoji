import { Button, Input, Select, SelectItem, Textarea } from '@heroui/react'
import { useTranslations } from 'next-intl'
import { CurrencySchema } from '@/entities/accountBook'
import {
  AccountBookFormValues,
  isAccountBookFormValid,
} from '@/utils/accountBookUtils'

type AccountBookFormProps = {
  cancelLabel?: string
  isSubmitting: boolean
  onCancel?: () => void
  onSubmit: () => void
  onValuesChange: (values: AccountBookFormValues) => void
  submitLabel: string
  values: AccountBookFormValues
  showCancel?: boolean
  showSection?: boolean
}

const currencyOptions = CurrencySchema.options

export default function AccountBookForm({
  cancelLabel,
  isSubmitting,
  onCancel,
  onSubmit,
  onValuesChange,
  submitLabel,
  values,
  showCancel = true,
  showSection = true,
}: AccountBookFormProps) {
  const t = useTranslations()

  const content = (
    <div className="space-y-5">
      <Input
        isRequired
        label={t('accountBook.form.name')}
        placeholder={t('accountBook.form.namePlaceholder')}
        value={values.name}
        onChange={(event) =>
          onValuesChange({
            ...values,
            name: event.target.value,
          })
        }
      />
      <Select
        label={t('accountBook.form.currency')}
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
        label={t('accountBook.form.description')}
        minRows={4}
        placeholder={t('accountBook.form.descriptionPlaceholder')}
        value={values.description}
        onChange={(event) =>
          onValuesChange({
            ...values,
            description: event.target.value,
          })
        }
      />

      <div className="flex flex-wrap justify-end gap-2">
        {showCancel && (
          <Button variant="light" onPress={onCancel}>
            {cancelLabel ?? t('common.cancel')}
          </Button>
        )}
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
  )

  if (!showSection) {
    return content
  }

  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-lg shadow-black/5">
      {content}
    </section>
  )
}
