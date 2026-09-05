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
import { SurfaceCard } from '@/components/ui/SurfaceCard'
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
    <SurfaceCard className="overflow-hidden shadow-none ring-1 ring-inset ring-border">
      {/* Root row */}
      <div className="flex w-full min-w-0 items-center gap-1 px-2 py-2 sm:gap-2 sm:px-3">
        {/* Drag handle */}
        <PiDotsSixVerticalBold
          aria-hidden="true"
          className="shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing"
          size={16}
          onPointerDown={(e) => rootDragControls?.start(e)}
        />

        {/* Expand toggle (left icon + name + sub-count) */}
        <button
          aria-expanded={isExpanded}
          className="flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-xl px-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:gap-3"
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
            <img alt={root.name} className="size-[18px]" src={root.imageUrl} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-body font-semibold text-foreground">
              {root.name}
            </span>
            <span className="truncate text-label text-muted-foreground">
              {t('categorySettings.subCategoryCount', {
                count: subCategories.length,
              })}
            </span>
          </div>
          <PiCaretDownBold
            className={`shrink-0 text-muted-foreground transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            size={14}
          />
        </button>

        {/* Root action buttons */}
        <button
          aria-label={`${t('common.edit')}: ${root.name}`}
          className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          type="button"
          onClick={() => onEditRoot?.(root)}
        >
          <PiPencilSimpleDuotone size={14} />
        </button>
        <button
          aria-label={`${t('common.delete')}: ${root.name}`}
          className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          type="button"
          onClick={() => onDeleteRoot?.(root)}
        >
          <PiTrashDuotone size={14} />
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
            className="mx-3 my-3 flex min-h-11 w-[calc(100%-1.5rem)] items-center justify-center gap-2 rounded-xl border border-dashed border-primary/50 px-3 py-2 text-body font-medium text-primary transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            type="button"
            onClick={() => onAddSubCategory(root)}
          >
            <PiPlusCircleDuotone size={14} />{' '}
            {t('categorySettings.addSubTitle')}
          </button>
        </div>
      ) : null}
    </SurfaceCard>
  )
}
