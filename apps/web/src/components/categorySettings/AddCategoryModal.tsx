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

  function renderIconLabel(key: CategoryIconKey) {
    return (
      <div className="flex items-center gap-2">
        <img
          alt=""
          aria-hidden="true"
          className="size-4 shrink-0"
          src={CATEGORY_ICONS[key]}
        />
        <span>{t(`categorySettings.iconOptions.${key}`)}</span>
      </div>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalContent>
        <ModalHeader>{resolveTitle()}</ModalHeader>

        <ModalBody className="flex flex-col gap-4">
          <Input
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

          <Select
            label={t('categorySettings.icon')}
            renderValue={(items) => {
              const selectedKey = items[0]?.key

              if (typeof selectedKey !== 'string') return null

              return renderIconLabel(selectedKey as CategoryIconKey)
            }}
            selectedKeys={[iconKey]}
            onSelectionChange={(keys) => {
              const key = Array.from(keys)[0] as CategoryIconKey
              if (key) setIconKey(key)
            }}
          >
            {ICON_KEYS.map((key) => (
              <SelectItem
                key={key}
                textValue={t(`categorySettings.iconOptions.${key}`)}
              >
                {renderIconLabel(key)}
              </SelectItem>
            ))}
          </Select>

          {/* Type indicator/selector — hidden in edit mode */}
          {!isEditMode &&
            (parentType ? (
              <p className="text-xs text-muted-foreground">
                {t('categorySettings.typeLabel')}{' '}
                <span className="font-medium">{typeDisplay(parentType)}</span>{' '}
                {t('categorySettings.typeInherited')}
              </p>
            ) : sectionType ? (
              <p className="text-xs text-muted-foreground">
                {t('categorySettings.typeLabel')}{' '}
                <span className="font-medium">{typeDisplay(sectionType)}</span>
              </p>
            ) : (
              <Select
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

        <ModalFooter>
          <Button disableRipple variant="flat" onPress={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button color="primary" disableRipple onPress={handleSubmit}>
            {isEditMode ? t('common.save') : t('common.add')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
