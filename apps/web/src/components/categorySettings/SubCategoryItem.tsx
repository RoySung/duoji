import { DragControls } from 'framer-motion'
import { useTranslations } from 'next-intl'
import {
  PiDotsSixVerticalBold,
  PiPencilSimpleDuotone,
  PiTrashDuotone,
} from 'react-icons/pi'
import { Category } from '@/entities/category'

type SubCategoryItemProps = {
  category: Category
  dragControls?: DragControls
  onEdit?: () => void
  onDelete?: () => void
}

export default function SubCategoryItem({
  category,
  dragControls,
  onEdit,
  onDelete,
}: SubCategoryItemProps) {
  const t = useTranslations()

  return (
    <div className="flex min-w-0 items-center gap-1 px-2 py-2 sm:gap-2 sm:px-3">
      {/* Drag handle */}
      <PiDotsSixVerticalBold
        aria-hidden="true"
        className="shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing"
        size={14}
        onPointerDown={(e) => dragControls?.start(e)}
      />

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary">
        <img
          alt={category.name}
          className="size-[14px]"
          src={category.imageUrl}
        />
      </div>
      <span className="min-w-0 flex-1 truncate text-body text-foreground">
        {category.name}
      </span>

      {/* Action buttons */}
      <button
        aria-label={`${t('common.edit')}: ${category.name}`}
        className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        type="button"
        onClick={onEdit}
      >
        <PiPencilSimpleDuotone size={14} />
      </button>
      <button
        aria-label={`${t('common.delete')}: ${category.name}`}
        className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        type="button"
        onClick={onDelete}
      >
        <PiTrashDuotone size={14} />
      </button>
    </div>
  )
}
