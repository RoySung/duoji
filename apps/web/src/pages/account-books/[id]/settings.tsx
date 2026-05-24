import { useRouter } from 'next/router'
import AccountBookEditPage from '@/components/accountBookSettings/AccountBookEditPage'
import EditAccountBookTutorial from '@/components/onboarding/EditAccountBookTutorial'
import AddMemberTutorial from '@/components/onboarding/AddMemberTutorial'
import ManageCategoriesTutorial from '@/components/onboarding/ManageCategoriesTutorial'

export default function AccountBookSettingsRoute() {
  const router = useRouter()
  const { id } = router.query
  const accountBookId = typeof id === 'string' ? id : null

  if (!accountBookId) {
    return null
  }

  return (
    <EditAccountBookTutorial>
      <AddMemberTutorial>
        <ManageCategoriesTutorial>
          <AccountBookEditPage accountBookId={accountBookId} />
        </ManageCategoriesTutorial>
      </AddMemberTutorial>
    </EditAccountBookTutorial>
  )
}
