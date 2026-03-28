import { useRouter } from 'next/router'
import AccountBookFormPage from '@/components/accountBookSettings/AccountBookFormPage'

export default function AccountBookDetailsRoute() {
  const router = useRouter()
  const { id } = router.query

  if (typeof id !== 'string') {
    return null
  }

  return <AccountBookFormPage accountBookId={id} mode="edit" />
}
