import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ReactNode } from 'react'
import { DEFAULT_CATEGORY_ICON_KEY } from '../src/constants/categoryIcons'
import UserSection from '../src/components/accountBookSettings/UserSection'
import AddCategoryModal from '../src/components/categorySettings/AddCategoryModal'
import CategoryGroupItem from '../src/components/categorySettings/CategoryGroupItem'
import DeleteConfirmModal from '../src/components/categorySettings/DeleteConfirmModal'

const mockAddVirtualUser = jest.fn()
const mockRenameVirtualUser = jest.fn()
const mockSoftDeleteVirtualUser = jest.fn()

const mockUserStoreState = {
  activeUsers: [
    {
      id: 'virtual-1',
      name: 'A very long household member name that must stay readable',
      accountBookId: 'book-1',
      avatarUrl: 'https://example.com/avatar.png',
      createdAt: 0,
      updatedAt: 0,
      type: 'virtual' as const,
    },
  ],
  isLoading: false,
  addVirtualUser: mockAddVirtualUser,
  renameVirtualUser: mockRenameVirtualUser,
  softDeleteVirtualUser: mockSoftDeleteVirtualUser,
}

jest.mock('../src/stores/user', () => ({
  useUserStore: (selector: (state: typeof mockUserStoreState) => unknown) =>
    selector(mockUserStoreState),
}))

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string, values?: Record<string, unknown>) => {
    const translations: Record<string, string> = {
      'common.add': 'Add',
      'common.cancel': 'Cancel',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.no': 'No',
      'common.save': 'Save',
      'common.yes': 'Yes',
      'categorySettings.addExpenseGroup': 'Add Expense Group',
      'categorySettings.addSubTitle': 'Add Sub-Category',
      'categorySettings.deleteModal.confirmPrefix': 'Delete ',
      'categorySettings.deleteModal.confirmSuffix': '?',
      'categorySettings.deleteModal.subAlsoPrefix': 'This also removes ',
      'categorySettings.deleteModal.subAlsoSuffix': ' sub-categories.',
      'categorySettings.deleteModal.title': 'Delete Category',
      'categorySettings.expense': 'Expense',
      'categorySettings.icon': 'Icon',
      'categorySettings.name': 'Name',
      'categorySettings.namePlaceholder': 'e.g. Dining',
      'categorySettings.nameRequired': 'Name is required.',
      'categorySettings.subCategoryCount': `${
        values?.count ?? 0
      } sub-categories`,
      'categorySettings.typeLabel': 'Type:',
      'userSection.addButton': 'Add',
      'userSection.addPlaceholder': 'Add a virtual person',
      'userSection.createSharedWallet': 'Create shared wallet',
      'userSection.description': 'Account-book members',
      'userSection.empty': 'No users yet.',
      'userSection.removePrompt': 'Remove?',
      'userSection.sharedWallet': 'Shared wallet',
      'userSection.title': 'Users',
    }

    return translations[key] ?? key
  },
}))

jest.mock('@heroui/react', () => {
  const React = jest.requireActual('react')

  return {
    addToast: jest.fn(),
    Button: ({
      children,
      className,
      disableRipple: _disableRipple,
      isDisabled,
      isIconOnly,
      isLoading,
      onPress,
      startContent,
      ...props
    }: any) => (
      <button
        className={className}
        disabled={isDisabled || isLoading}
        onClick={onPress}
        {...props}
      >
        {startContent}
        {children}
      </button>
    ),
    Input: ({
      classNames,
      errorMessage,
      isInvalid,
      isRequired,
      label,
      onChange,
      onValueChange,
      value,
      ...props
    }: any) => (
      <label>
        {label ? <span>{label}</span> : null}
        <span className={classNames?.inputWrapper} data-slot="input-wrapper">
          <input
            aria-invalid={isInvalid || undefined}
            required={isRequired}
            value={value}
            onChange={(event) => {
              onChange?.(event)
              onValueChange?.(event.currentTarget.value)
            }}
            {...props}
          />
        </span>
        {isInvalid ? <span>{errorMessage}</span> : null}
      </label>
    ),
    Modal: ({ children, classNames, isOpen }: any) =>
      isOpen ? (
        <div className={classNames?.base} role="dialog">
          {children}
        </div>
      ) : null,
    ModalBody: ({ children, className }: any) => (
      <div className={className}>{children}</div>
    ),
    ModalContent: ({ children, className }: any) => (
      <div className={className}>
        {typeof children === 'function' ? children(jest.fn()) : children}
      </div>
    ),
    ModalFooter: ({ children, className }: any) => (
      <div className={className}>{children}</div>
    ),
    ModalHeader: ({ children, className }: any) => (
      <div className={className}>{children}</div>
    ),
    Select: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    SelectItem: ({ children }: { children: ReactNode }) => (
      <div>{children}</div>
    ),
  }
})

jest.mock('framer-motion', () => {
  const React = jest.requireActual('react')

  function ReorderItem({ children }: { children: ReactNode }) {
    return <div>{children}</div>
  }

  function ReorderGroup({ children }: { children: ReactNode }) {
    return <div>{children}</div>
  }

  return {
    Reorder: { Group: ReorderGroup, Item: ReorderItem },
    useDragControls: () => ({ start: jest.fn() }),
  }
})

const rootCategory = {
  id: 'root-1',
  name: 'A very long dining and household category group name',
  imageUrl: 'https://example.com/dining.svg',
  description: '',
  type: 'expense' as const,
  parentId: null,
  accountBookId: 'book-1',
  sortOrder: 0,
}

const subCategory = {
  ...rootCategory,
  id: 'sub-1',
  name: 'A very long neighborhood breakfast sub-category name',
  parentId: rootCategory.id,
}

describe('Category and member presentation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAddVirtualUser.mockResolvedValue({ id: 'virtual-2' })
    mockRenameVirtualUser.mockResolvedValue(true)
    mockSoftDeleteVirtualUser.mockResolvedValue(true)
  })

  it('keeps category names and every row action inside 44px mobile-safe controls', () => {
    const onAddSubCategory = jest.fn()
    const onEditRoot = jest.fn()
    const onDeleteRoot = jest.fn()

    render(
      <CategoryGroupItem
        root={rootCategory}
        subCategories={[subCategory]}
        onAddSubCategory={onAddSubCategory}
        onDeleteRoot={onDeleteRoot}
        onEditRoot={onEditRoot}
      />
    )

    const rootName = screen.getByText(rootCategory.name)
    expect(rootName.className).toContain('truncate')
    expect(rootName.className).toContain('text-body')
    expect(screen.getByText('1 sub-categories').className).toContain(
      'text-label'
    )

    const expandButton = rootName.closest('button')
    expect(expandButton?.className).toContain('min-h-11')

    const editButton = screen.getByRole('button', {
      name: `Edit: ${rootCategory.name}`,
    })
    const deleteButton = screen.getByRole('button', {
      name: `Delete: ${rootCategory.name}`,
    })
    expect(editButton.className).toContain('min-h-11')
    expect(deleteButton.className).toContain('min-w-11')

    fireEvent.click(editButton)
    fireEvent.click(deleteButton)
    fireEvent.click(expandButton!)

    expect(onEditRoot).toHaveBeenCalledWith(rootCategory)
    expect(onDeleteRoot).toHaveBeenCalledWith(rootCategory)

    const addSubButton = screen.getByRole('button', {
      name: 'Add Sub-Category',
    })
    expect(addSubButton.className).toContain('min-h-11')
    fireEvent.click(addSubButton)
    expect(onAddSubCategory).toHaveBeenCalledWith(rootCategory)
  })

  it('keeps category validation, selected icon state, and submit callbacks intact', () => {
    const onClose = jest.fn()
    const onSubmit = jest.fn()

    render(
      <AddCategoryModal
        isOpen
        sectionType="expense"
        onClose={onClose}
        onSubmit={onSubmit}
      />
    )

    const addButton = screen.getByRole('button', { name: 'Add' })
    expect(addButton.className).toContain('min-h-11')
    expect(
      screen.getByRole('heading', { name: 'Add Expense Group' }).className
    ).toContain('text-title')

    fireEvent.click(addButton)
    expect(screen.getByText('Name is required.')).toBeTruthy()
    expect(onSubmit).not.toHaveBeenCalled()

    const firstIconButton = screen.getAllByRole('button', {
      pressed: false,
    })[0]
    expect(firstIconButton?.className).toContain('min-h-11')

    fireEvent.change(screen.getByPlaceholderText('e.g. Dining'), {
      target: { value: 'Dining' },
    })
    fireEvent.click(addButton)

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Dining',
      iconKey: DEFAULT_CATEGORY_ICON_KEY,
      type: 'expense',
    })
    expect(onClose).toHaveBeenCalled()
  })

  it('wraps destructive confirmation content and preserves both callbacks', () => {
    const onClose = jest.fn()
    const onConfirm = jest.fn()

    render(
      <DeleteConfirmModal
        categoryName="An exceptionally long category name that wraps on mobile"
        isOpen
        subCount={12}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    )

    const cancel = screen.getByRole('button', { name: 'Cancel' })
    const remove = screen.getByRole('button', { name: 'Delete' })
    expect(cancel.className).toContain('min-h-11')
    expect(remove.className).toContain('min-h-11')

    fireEvent.click(cancel)
    fireEvent.click(remove)
    expect(onClose).toHaveBeenCalled()
    expect(onConfirm).toHaveBeenCalled()
  })

  it('keeps member rows responsive and sends trimmed values to the user store', async () => {
    render(<UserSection accountBookId="book-1" />)

    expect(screen.getByText('Users').closest('section')?.className).toContain(
      'surface-card'
    )
    expect(screen.getByRole('heading', { name: 'Users' }).className).toContain(
      'text-title'
    )
    expect(
      screen.getByText(mockUserStoreState.activeUsers[0].name).className
    ).toContain('text-body')

    const editButton = screen.getByRole('button', {
      name: `Edit: ${mockUserStoreState.activeUsers[0].name}`,
    })
    const removeButton = screen.getByRole('button', {
      name: `Delete: ${mockUserStoreState.activeUsers[0].name}`,
    })
    expect(editButton.className).toContain('min-h-11')
    expect(removeButton.className).toContain('min-w-11')

    fireEvent.change(screen.getByPlaceholderText('Add a virtual person'), {
      target: { value: '  Alex  ' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))

    await waitFor(() => {
      expect(mockAddVirtualUser).toHaveBeenCalledWith('book-1', 'Alex')
    })
  })
})
