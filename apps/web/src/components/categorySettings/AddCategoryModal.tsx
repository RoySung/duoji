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
} from '@heroui/react'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  CATEGORY_ICONS,
  CategoryIconKey,
  DEFAULT_CATEGORY_ICON_KEY,
} from '@/constants/categoryIcons'
import { TransactionType } from '@/entities/transaction'
import {
  compactInputClassNames,
  compactSelectClassNames,
  transactionModalClassNames,
} from '@/components/TransactionModal/formControlStyles'

const ICON_KEYS = Object.keys(CATEGORY_ICONS) as CategoryIconKey[]

type AddCategoryModalProps = {
  isOpen: boolean
  mode?: 'add' | 'edit'
  initialValues?: { name: string; iconKey: CategoryIconKey }
  /** When provided, the new category is a sub-category of this parent. */
  parentType?: TransactionType
  /** When provided, locks the type for a new root category inside a typed section. */
  sectionType?: TransactionType
  onClose: () => void
  onSubmit: (values: {
    name: string
    iconKey: CategoryIconKey
    type: TransactionType
  }) => void
}

export default function AddCategoryModal({
  isOpen,
  mode = 'add',
  initialValues,
  parentType,
  sectionType,
  onClose,
  onSubmit,
}: AddCategoryModalProps) {
  const t = useTranslations()
  const [name, setName] = useState('')
  const [iconKey, setIconKey] = useState<CategoryIconKey>(
    DEFAULT_CATEGORY_ICON_KEY
  )
  const [type, setType] = useState<TransactionType>(
    parentType ?? sectionType ?? 'expense'
  )
  const [nameError, setNameError] = useState('')

  // Sync type when parent/section changes
  const resolvedType: TransactionType = parentType ?? sectionType ?? type

  // Pre-fill in edit mode
  useEffect(() => {
    if (isOpen && mode === 'edit' && initialValues) {
      setName(initialValues.name)
      setIconKey(initialValues.iconKey)
    }
  }, [isOpen, mode, initialValues])

  function handleClose() {
    setName('')
    setIconKey(DEFAULT_CATEGORY_ICON_KEY)
    setType(parentType ?? sectionType ?? 'expense')
    setNameError('')
    onClose()
  }

  function handleSubmit() {
    const trimmed = name.trim()
    if (!trimmed) {
      setNameError(t('categorySettings.nameRequired'))
      return
    }
    onSubmit({ name: trimmed, iconKey, type: resolvedType })
    handleClose()
  }

  const isEditMode = mode === 'edit'

  function resolveTitle() {
    if (isEditMode) return t('categorySettings.editTitle')

    if (parentType) return t('categorySettings.addSubTitle')
    return sectionType === 'income'
      ? t('categorySettings.addIncomeGroup')
      : t('categorySettings.addExpenseGroup')
  }

  function typeDisplay(type: TransactionType) {
    return type === 'income'
      ? t('categorySettings.income')
      : t('categorySettings.expense')
  }

  return (
    <Modal
      classNames={transactionModalClassNames}
      isOpen={isOpen}
      placement="bottom"
      scrollBehavior="inside"
      onClose={handleClose}
    >
      <ModalContent className="max-h-[calc(100dvh-env(safe-area-inset-top))] overflow-hidden sm:max-h-[calc(100dvh-4rem)]">
        <ModalHeader className="border-b border-border px-5 py-4 sm:px-6">
          <h2 className="text-title font-semibold text-foreground">
            {resolveTitle()}
          </h2>
        </ModalHeader>

        <ModalBody className="flex min-h-0 flex-col gap-5 overflow-y-auto px-5 py-5 sm:px-6">
          <Input
            classNames={compactInputClassNames}
            isRequired
            errorMessage={nameError}
            isInvalid={!!nameError}
            label={t('categorySettings.name')}
            placeholder={t('categorySettings.namePlaceholder')}
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (nameError) setNameError('')
            }}
          />

          <div className="flex flex-col gap-2">
            <span className="text-body font-medium text-foreground">
              {t('categorySettings.icon')}
            </span>
            <div className="grid max-h-[11.5rem] grid-cols-5 gap-2 overflow-y-auto rounded-xl bg-secondary p-2 sm:grid-cols-6">
              {ICON_KEYS.map((key) => {
                const isSelected = iconKey === key
                const labelText = t(`categorySettings.iconOptions.${key}`)
                return (
                  <button
                    key={key}
                    type="button"
                    title={labelText}
                    aria-label={labelText}
                    aria-pressed={isSelected}
                    className={`flex min-h-11 min-w-11 items-center justify-center rounded-xl border-2 p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-transparent bg-card/70 hover:bg-card'
                    }`}
                    onClick={() => setIconKey(key)}
                  >
                    <img
                      alt={labelText}
                      className="size-5 shrink-0"
                      src={CATEGORY_ICONS[key]}
                    />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Type indicator/selector — hidden in edit mode */}
          {!isEditMode &&
            (parentType ? (
              <p className="text-label text-muted-foreground">
                {t('categorySettings.typeLabel')}{' '}
                <span className="font-medium">{typeDisplay(parentType)}</span>{' '}
                {t('categorySettings.typeInherited')}
              </p>
            ) : sectionType ? (
              <p className="text-label text-muted-foreground">
                {t('categorySettings.typeLabel')}{' '}
                <span className="font-medium">{typeDisplay(sectionType)}</span>
              </p>
            ) : (
              <Select
                classNames={compactSelectClassNames}
                label={t('categorySettings.type')}
                selectedKeys={[type]}
                onSelectionChange={(keys) => {
                  const val = Array.from(keys)[0] as TransactionType
                  if (val) setType(val)
                }}
              >
                <SelectItem
                  key="expense"
                  textValue={t('categorySettings.expense')}
                >
                  {t('categorySettings.expense')}
                </SelectItem>
                <SelectItem
                  key="income"
                  textValue={t('categorySettings.income')}
                >
                  {t('categorySettings.income')}
                </SelectItem>
              </Select>
            ))}
        </ModalBody>

        <ModalFooter className="grid grid-cols-2 gap-3 border-t border-border px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:px-6 sm:pb-4">
          <Button
            className="min-h-11 w-full rounded-xl text-body"
            disableRipple
            variant="flat"
            onPress={handleClose}
          >
            {t('common.cancel')}
          </Button>
          <Button
            className="min-h-11 w-full rounded-xl text-body"
            color="primary"
            disableRipple
            onPress={handleSubmit}
          >
            {isEditMode ? t('common.save') : t('common.add')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
