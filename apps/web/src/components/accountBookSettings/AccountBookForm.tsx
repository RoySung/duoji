import { Button, Input, Select, SelectItem, Textarea } from '@heroui/react'
import { useTranslations } from 'next-intl'
import { DEFAULT_CURRENCIES } from '@/entities/accountBook'
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

const CUSTOM_CURRENCY_KEY = '__custom__'

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

  // currency === '' represents the "custom" mode before the user fills in a value
  const isCustomCurrency = !DEFAULT_CURRENCIES.includes(
    values.currency as (typeof DEFAULT_CURRENCIES)[number]
  )
  const selectValue = isCustomCurrency ? CUSTOM_CURRENCY_KEY : values.currency

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
        selectedKeys={[selectValue]}
        onSelectionChange={(keys) => {
          const nextKey = Array.from(keys)[0] as string | undefined

          if (!nextKey) {
            return
          }

          if (nextKey === CUSTOM_CURRENCY_KEY) {
            onValuesChange({
              ...values,
              currency: '',
            })
          } else {
            onValuesChange({
              ...values,
              currency: nextKey,
            })
          }
        }}
        items={[
          ...DEFAULT_CURRENCIES.map((c) => ({ key: c, label: c })),
          {
            key: CUSTOM_CURRENCY_KEY,
            label: t('accountBook.form.currencyCustom'),
          },
        ]}
      >
        {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
      </Select>
      {isCustomCurrency && (
        <Input
          isRequired
          label={t('accountBook.form.currencyCustomLabel')}
          maxLength={10}
          placeholder={t('accountBook.form.currencyCustomPlaceholder')}
          value={values.currency}
          isInvalid={values.currency.trim().length === 0}
          errorMessage={
            values.currency.trim().length === 0
              ? t('accountBook.form.currencyCustomError')
              : undefined
          }
          onChange={(event) =>
            onValuesChange({
              ...values,
              currency: event.target.value.toUpperCase(),
            })
          }
        />
      )}
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
