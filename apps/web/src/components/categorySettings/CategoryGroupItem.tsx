import { useState } from 'react'
import { DragControls, Reorder, useDragControls } from 'framer-motion'
import { useTranslations } from 'next-intl'
import {
  PiCaretDownBold,
  PiDotsSixVerticalBold,
  PiPencilSimpleDuotone,
  PiPlusCircleDuotone,
  PiTrashDuotone,
} from 'react-icons/pi'
import { Category } from '@/entities/category'
import SubCategoryItem from './SubCategoryItem'

type CategoryGroupItemProps = {
  root: Category
  subCategories: Category[]
  rootDragControls?: DragControls
  onAddSubCategory: (parent: Category) => void
  onEditRoot?: (category: Category) => void
  onDeleteRoot?: (category: Category) => void
  onEditSub?: (category: Category) => void
  onDeleteSub?: (category: Category) => void
  onReorderSubs?: (newOrder: Category[]) => void
}

function DraggableSubRow({
  sub,
  onEdit,
  onDelete,
}: {
  sub: Category
  onEdit?: () => void
  onDelete?: () => void
}) {
  const dragControls = useDragControls()
  return (
    <Reorder.Item value={sub} dragListener={false} dragControls={dragControls}>
      <SubCategoryItem
        category={sub}
        dragControls={dragControls}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    </Reorder.Item>
  )
}

export default function CategoryGroupItem({
  root,
  subCategories,
  rootDragControls,
  onAddSubCategory,
  onEditRoot,
  onDeleteRoot,
  onEditSub,
  onDeleteSub,
  onReorderSubs,
}: CategoryGroupItemProps) {
  const t = useTranslations()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm shadow-black/5">
      {/* Root row */}
      <div className="flex w-full items-center gap-2 px-3 py-3">
        {/* Drag handle */}
        <PiDotsSixVerticalBold
          className="flex-shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing"
          size={18}
          onPointerDown={(e) => rootDragControls?.start(e)}
        />

        {/* Expand toggle (left icon + name + sub-count) */}
        <button
          aria-expanded={isExpanded}
          className="flex flex-1 items-center gap-3 text-left"
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-muted">
            <img alt={root.name} className="h-5 w-5" src={root.imageUrl} />
          </div>
          <div className="flex flex-1 flex-col">
            <span className="font-semibold text-foreground">{root.name}</span>
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              {t('categorySettings.subCategoryCount', {
                count: subCategories.length,
              })}
            </span>
          </div>
          <PiCaretDownBold
            className={`flex-shrink-0 text-muted-foreground transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            size={16}
          />
        </button>

        {/* Root action buttons */}
        <button
          aria-label={t('common.edit')}
          className="flex-shrink-0 rounded p-1 text-muted-foreground transition hover:text-foreground"
          type="button"
          onClick={() => onEditRoot?.(root)}
        >
          <PiPencilSimpleDuotone size={16} />
        </button>
        <button
          aria-label={t('common.delete')}
          className="flex-shrink-0 rounded p-1 text-muted-foreground transition hover:text-danger"
          type="button"
          onClick={() => onDeleteRoot?.(root)}
        >
          <PiTrashDuotone size={16} />
        </button>
      </div>

      {/* Expanded sub-categories */}
      {isExpanded ? (
        <div className="border-t border-border">
          <Reorder.Group
            as="div"
            axis="y"
            values={subCategories}
            onReorder={(newOrder) => onReorderSubs?.(newOrder)}
          >
            {subCategories.map((sub) => (
              <DraggableSubRow
                key={sub.id}
                sub={sub}
                onDelete={() => onDeleteSub?.(sub)}
                onEdit={() => onEditSub?.(sub)}
              />
            ))}
          </Reorder.Group>

          {/* ADD SUB-CATEGORY */}
          <button
            className="mx-4 my-2 flex w-[calc(100%-2rem)] items-center justify-center gap-2 rounded-xl border border-dashed border-primary/50 py-2 text-sm font-medium text-primary transition hover:bg-primary/5"
            type="button"
            onClick={() => onAddSubCategory(root)}
          >
            <PiPlusCircleDuotone className="text-base" />{' '}
            {t('categorySettings.addSubTitle')}
          </button>
        </div>
      ) : null}
    </div>
  )
}
