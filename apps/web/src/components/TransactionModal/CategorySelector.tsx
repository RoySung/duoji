import { Category } from '@/entities/category'
import { Tabs, Tab, Avatar, addToast } from '@heroui/react'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { PiWarning, PiPlus } from 'react-icons/pi'
import { useCategoryStore } from '@/stores/category'
import AddCategoryModal from '@/components/categorySettings/AddCategoryModal'
import { CategoryIconKey, CATEGORY_ICONS } from '@/constants/categoryIcons'
import { TransactionType } from '@/entities/transaction'
import { useTranslations } from 'next-intl'
import { transactionTabsClassNames } from './formControlStyles'

type Props = {
  selectedCategoryId: string
  categoryList: Category[]
  onSelectCategory: (category: Category) => void
  accountBookId: string
  onCategoryAdded?: () => void
}

// 輔助函數：根據 parentId 獲取子分類
const getChildCategories = (parentId: string, categoryList: Category[]) => {
  return categoryList.filter((category) => category.parentId === parentId)
}

// 輔助函數：獲取主分類（parentId 為 null 的分類）
const getRootCategories = (categoryList: Category[]) => {
  return categoryList.filter((category) => category.parentId === null)
}

// 輔助函數：根據子分類 ID 找到對應的主分類 ID
const findRootCategoryId = (
  selectedCategoryId: string,
  categoryList: Category[]
) => {
  const selectedCategory = categoryList.find(
    (cat) => cat.id === selectedCategoryId
  )
  if (!selectedCategory) return null

  // 如果選中的是主分類，直接返回
  if (selectedCategory.parentId === null) return selectedCategory.id

  // 如果選中的是子分類，返回其 parentId
  return selectedCategory.parentId
}

export default function CategorySelector({
  categoryList,
  selectedCategoryId,
  onSelectCategory,
  accountBookId,
  onCategoryAdded,
}: Props) {
  const t = useTranslations()
  const rootCategories = getRootCategories(categoryList)
  const defaultSelectedRootCategoryId = findRootCategoryId(
    selectedCategoryId,
    categoryList
  )

  const [selectedRootCategoryId, setSelectedRootCategoryId] = useState<
    Category['id']
  >(defaultSelectedRootCategoryId || '')

  const [addSubModalOpen, setAddSubModalOpen] = useState(false)
  const [addSubParent, setAddSubParent] = useState<Category | null>(null)

  const addCategory = useCategoryStore((s) => s.addCategory)

  useEffect(() => {
    setSelectedRootCategoryId(defaultSelectedRootCategoryId || '')
  }, [defaultSelectedRootCategoryId])

  async function handleAddSubSubmit({
    name,
    iconKey,
    type,
  }: {
    name: string
    iconKey: CategoryIconKey
    type: TransactionType
  }) {
    if (!addSubParent) return
    try {
      const created = await addCategory({
        name,
        imageUrl: CATEGORY_ICONS[iconKey],
        description: '',
        type,
        parentId: addSubParent.id,
        accountBookId,
      })
      setAddSubModalOpen(false)
      setAddSubParent(null)
      onSelectCategory(created)
      onCategoryAdded?.()
    } catch (error) {
      console.error('Failed to add subcategory:', error)
      addToast({
        title: t('categorySettings.toast.saveFailed'),
        color: 'danger',
      })
    }
  }

  const handleOpenAddSubModal = (category: Category) => {
    setAddSubParent(category)
    setAddSubModalOpen(true)
  }

  return (
    <div className="category-selector w-full">
      {selectedCategoryId === '' ? (
        <div
          className="mb-3 flex min-h-11 items-center gap-2 rounded-xl bg-warning-50 px-3 py-2 text-body leading-5 text-warning-800 ring-1 ring-warning-200 dark:bg-warning-50/10 dark:text-warning-300 dark:ring-warning-400/30"
          role="alert"
        >
          <PiWarning size={14} className="shrink-0" />
          <span>Please select a category</span>
        </div>
      ) : null}
      <Tabs
        variant="solid"
        selectedKey={selectedRootCategoryId}
        onSelectionChange={(key) => setSelectedRootCategoryId(key as string)}
        className="w-full overflow-auto"
        classNames={transactionTabsClassNames}
      >
        {rootCategories.map((category) => {
          const childCategories = getChildCategories(category.id, categoryList)

          return (
            <Tab
              key={category.id}
              title={
                <div className="flex items-center gap-2">
                  <Avatar
                    src={category.imageUrl}
                    alt={category.name}
                    className="h-5 w-5 shrink-0 bg-primary/15"
                    classNames={{ img: 'p-0.5' }}
                  />
                  <span className="max-w-32 truncate text-foreground">
                    {category.name}
                  </span>
                </div>
              }
              className="w-fit max-w-full"
            >
              <div className="grid grid-flow-col grid-rows-2 gap-2 overflow-auto py-2">
                {childCategories.map((child) => (
                  <div
                    key={child.id}
                    aria-pressed={child.id === selectedCategoryId}
                    role="button"
                    tabIndex={0}
                    className={clsx(
                      'flex min-h-11 cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-body text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card',
                      child.id === selectedCategoryId
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-muted/60'
                    )}
                    onClick={() => onSelectCategory(child)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        onSelectCategory(child)
                      }
                    }}
                  >
                    <Avatar
                      src={child.imageUrl}
                      alt={child.name}
                      className="h-5 w-5 shrink-0 bg-card/80"
                      classNames={{ img: 'p-0.5' }}
                    />
                    <span className="w-[max-content] max-w-40 truncate text-inherit">
                      {child.name}
                    </span>
                  </div>
                ))}
                {/* 新增子分類按鈕 */}
                <div
                  role="button"
                  tabIndex={0}
                  className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-border px-3 py-2 text-body text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                  onClick={() => handleOpenAddSubModal(category)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleOpenAddSubModal(category)
                    }
                  }}
                >
                  <PiPlus size={12} />
                  <span className="w-[max-content]">
                    {t('categorySettings.addSubTitle')}
                  </span>
                </div>
              </div>
            </Tab>
          )
        })}
      </Tabs>

      {addSubParent ? (
        <AddCategoryModal
          isOpen={addSubModalOpen}
          parentType={addSubParent.type}
          onClose={() => {
            setAddSubModalOpen(false)
            setAddSubParent(null)
          }}
          onSubmit={handleAddSubSubmit}
        />
      ) : null}
    </div>
  )
}
