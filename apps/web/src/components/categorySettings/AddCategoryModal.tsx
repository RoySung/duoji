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
      setNameError('Name is required.')
      return
    }
    onSubmit({ name: trimmed, iconKey, type: resolvedType })
    handleClose()
  }

  const isEditMode = mode === 'edit'

  function resolveTitle() {
    if (isEditMode) return 'Edit Category'

    if (parentType) return 'Add Sub-Category'
    return `Add ${sectionType === 'income' ? 'Income' : 'Expense'} Group`
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
            label="Name"
            placeholder="e.g. Dining"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (nameError) setNameError('')
            }}
          />

          <Select
            label="Icon"
            selectedKeys={[iconKey]}
            onSelectionChange={(keys) => {
              const key = Array.from(keys)[0] as CategoryIconKey
              if (key) setIconKey(key)
            }}
          >
            {ICON_KEYS.map((key) => (
              <SelectItem
                key={key}
                startContent={
                  <img
                    alt={key}
                    className="h-4 w-4"
                    src={CATEGORY_ICONS[key]}
                  />
                }
                textValue={key}
              >
                {key}
              </SelectItem>
            ))}
          </Select>

          {/* Type indicator/selector — hidden in edit mode */}
          {!isEditMode &&
            (parentType ? (
              <p className="text-xs text-muted-foreground">
                Type:{' '}
                <span className="font-medium capitalize">{parentType}</span>{' '}
                (inherited from parent)
              </p>
            ) : sectionType ? (
              <p className="text-xs text-muted-foreground">
                Type:{' '}
                <span className="font-medium capitalize">{sectionType}</span>
              </p>
            ) : (
              <Select
                label="Type"
                selectedKeys={[type]}
                onSelectionChange={(keys) => {
                  const val = Array.from(keys)[0] as TransactionType
                  if (val) setType(val)
                }}
              >
                <SelectItem key="expense" textValue="Expense">
                  Expense
                </SelectItem>
                <SelectItem key="income" textValue="Income">
                  Income
                </SelectItem>
              </Select>
            ))}
        </ModalBody>

        <ModalFooter>
          <Button disableRipple variant="flat" onPress={handleClose}>
            Cancel
          </Button>
          <Button color="primary" disableRipple onPress={handleSubmit}>
            {isEditMode ? 'Save' : 'Add'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
