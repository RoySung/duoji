import { Category } from '@/entities/transaction'
import { Tabs, Tab, Avatar } from '@heroui/react'
import clsx from 'clsx'
import { useState } from 'react'

type Props = {
  selectedCategoryId: string
  categoryList: Category[]
  onSelectCategory: (category: Category) => void
}

export default function CategorySelector({
  categoryList,
  selectedCategoryId,
  onSelectCategory,
}: Props) {
  const defaultSelectedRootCategoryId = categoryList.find((category) =>
    category.children?.some((child) => child.id === selectedCategoryId)
  )?.id
  const [selectedRootCategoryId, setSelectedRootCategoryId] = useState<
    Category['id']
  >(defaultSelectedRootCategoryId || '')

  return (
    <div className="category-selector w-full">
      <Tabs
        variant="solid"
        selectedKey={selectedRootCategoryId}
        onSelectionChange={(key) => setSelectedRootCategoryId(key as string)}
        className="w-full overflow-auto"
      >
        {categoryList.map((category) => (
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
            <div className="grid  grid-rows-2 grid-flow-col gap-1 overflow-auto">
              {category.children?.map((child) => (
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
        ))}
      </Tabs>
    </div>
  )
}
