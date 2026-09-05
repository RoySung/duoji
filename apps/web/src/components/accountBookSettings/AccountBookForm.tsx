import { Input, Select, SelectItem, Textarea } from '@heroui/react'
import { useTranslations } from 'next-intl'
import { DEFAULT_CURRENCIES } from '@/entities/accountBook'
import {
  compactInputClassNames,
  compactSelectClassNames,
} from '@/components/TransactionModal/formControlStyles'
import { SurfaceCard } from '@/components/ui/SurfaceCard'
import { AppButton } from '@/components/ui/AppButton'
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
        classNames={compactInputClassNames}
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
      <div
        className={
          isCustomCurrency ? 'grid gap-4 sm:grid-cols-2' : 'w-full sm:max-w-sm'
        }
      >
        <Select
          classNames={compactSelectClassNames}
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
        {isCustomCurrency ? (
          <Input
            classNames={compactInputClassNames}
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
        ) : null}
      </div>
      <Textarea
        classNames={compactInputClassNames}
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

      <div className="flex flex-col gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
        {showCancel && (
          <AppButton
            className="min-h-11 w-full rounded-xl text-body sm:w-auto"
            appearance="light"
            tone="neutral"
            onPress={onCancel}
          >
            {cancelLabel ?? t('common.cancel')}
          </AppButton>
        )}
        <AppButton
          className="min-h-11 w-full rounded-xl px-5 text-body sm:w-auto"
          disableRipple
          appearance="solid"
          isDisabled={!isAccountBookFormValid(values)}
          isLoading={isSubmitting}
          onPress={onSubmit}
          tone="primary"
        >
          {submitLabel}
        </AppButton>
      </div>
    </div>
  )

  if (!showSection) {
    return content
  }

  return <SurfaceCard className="p-5 sm:p-6">{content}</SurfaceCard>
}
