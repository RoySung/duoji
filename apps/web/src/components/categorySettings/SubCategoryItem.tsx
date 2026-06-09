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
    <div className="flex items-center gap-2 px-3 py-2">
      {/* Drag handle */}
      <PiDotsSixVerticalBold
        className="flex-shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing"
        size={16}
        onPointerDown={(e) => dragControls?.start(e)}
      />

      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted">
        <img alt={category.name} className="h-4 w-4" src={category.imageUrl} />
      </div>
      <span className="flex-1 text-sm text-foreground">{category.name}</span>

      {/* Action buttons */}
      <button
        aria-label={t('common.edit')}
        className="flex-shrink-0 rounded p-1 text-muted-foreground transition hover:text-foreground"
        type="button"
        onClick={onEdit}
      >
        <PiPencilSimpleDuotone size={16} />
      </button>
      <button
        aria-label={t('common.delete')}
        className="flex-shrink-0 rounded p-1 text-muted-foreground transition hover:text-danger"
        type="button"
        onClick={onDelete}
      >
        <PiTrashDuotone size={16} />
      </button>
    </div>
  )
}
