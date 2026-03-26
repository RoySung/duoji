import { useRouter } from 'next/router'
import CategorySettingsPage from '@/components/categorySettings/CategorySettingsPage'

export default function CategoriesPage() {
  const router = useRouter()
  const { id } = router.query

  if (typeof id !== 'string') {
    return null
  }

  return <CategorySettingsPage accountBookId={id} />
}
