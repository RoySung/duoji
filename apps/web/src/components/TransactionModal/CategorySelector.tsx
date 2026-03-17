import { Category } from '@/entities/transaction'
import { Tabs, Tab, Avatar } from '@heroui/react'
import clsx from 'clsx'
import { useEffect, useState } from 'react'

type Props = {
  selectedCategoryId: string
  categoryList: Category[]
  onSelectCategory: (category: Category) => void
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
const findRootCategoryId = (selectedCategoryId: string, categoryList: Category[]) => {
  const selectedCategory = categoryList.find((cat) => cat.id === selectedCategoryId)
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
}: Props) {
  const rootCategories = getRootCategories(categoryList)
  const defaultSelectedRootCategoryId = findRootCategoryId(selectedCategoryId, categoryList)
  
  const [selectedRootCategoryId, setSelectedRootCategoryId] = useState<
    Category['id']
  >(defaultSelectedRootCategoryId || '')

  useEffect(() => {
    setSelectedRootCategoryId(defaultSelectedRootCategoryId || '')
  }, [defaultSelectedRootCategoryId])

  return (
    <div className="category-selector w-full">
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
              </div>
            </Tab>
          )
        })}
      </Tabs>
    </div>
  )
}
