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
      {selectedCategoryId === '' && (
        <div className="mb-2 flex items-center gap-1.5 rounded-lg border border-warning-200 bg-warning-50 px-3 py-2 text-sm text-warning-700">
          <PiWarning size={16} className="shrink-0" />
          <span>Please select a category</span>
        </div>
      )}
      <Tabs
        variant="solid"
        selectedKey={selectedRootCategoryId}
        onSelectionChange={(key) => setSelectedRootCategoryId(key as string)}
        className="w-full overflow-auto"
      >
        {rootCategories.map((category) => {
          const childCategories = getChildCategories(category.id, categoryList)

          return (
            <Tab
              key={category.id}
              title={
                <div className="flex items-center gap-2">
                  <Avatar
                    isBordered
                    color="secondary"
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-4 h-4"
                  />
                  <span className="text-default-800">{category.name}</span>
                </div>
              }
              className="w-fit max-w-full"
            >
              <div className="grid grid-rows-2 grid-flow-col gap-1 overflow-auto">
                {childCategories.map((child) => (
                  <div
                    key={child.id}
                    className={clsx({
                      'flex items-center gap-2 cursor-pointer hover:bg-default-100 p-2 rounded':
                        true,
                      '!bg-primary/80': child.id === selectedCategoryId,
                    })}
                    onClick={() => onSelectCategory(child)}
                  >
                    <Avatar
                      isBordered
                      color="secondary"
                      src={child.imageUrl}
                      alt={child.name}
                      className="w-4 h-4"
                    />
                    <span className="text-default-800 w-[max-content]">
                      {child.name}
                    </span>
                  </div>
                ))}
                {/* 新增子分類按鈕 */}
                <div
                  role="button"
                  tabIndex={0}
                  className="flex items-center gap-1.5 cursor-pointer p-2 rounded border border-dashed border-default-300 text-default-500 hover:border-primary hover:text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
                  onClick={() => handleOpenAddSubModal(category)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleOpenAddSubModal(category)
                    }
                  }}
                >
                  <PiPlus size={14} />
                  <span className="text-xs w-[max-content]">{t('categorySettings.addSubTitle')}</span>
                </div>
              </div>
            </Tab>
          )
        })}
      </Tabs>

      {addSubParent && (
        <AddCategoryModal
          isOpen={addSubModalOpen}
          parentType={addSubParent.type}
          onClose={() => {
            setAddSubModalOpen(false)
            setAddSubParent(null)
          }}
          onSubmit={handleAddSubSubmit}
        />
      )}
    </div>
  )
}
