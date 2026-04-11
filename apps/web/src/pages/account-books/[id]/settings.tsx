import { useRouter } from 'next/router'
import AccountBookEditPage from '@/components/accountBookSettings/AccountBookEditPage'

export default function AccountBookSettingsRoute() {
  const router = useRouter()
  const { id } = router.query
  const accountBookId = typeof id === 'string' ? id : null

  if (!accountBookId) {
    return null
  }

  return <AccountBookEditPage accountBookId={accountBookId} />
}
