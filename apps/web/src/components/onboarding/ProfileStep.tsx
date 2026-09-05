import { Button, Input, addToast } from '@heroui/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import StepShell from './StepShell'
import { compactInputClassNames } from '@/components/TransactionModal/formControlStyles'
import { useUserStore } from '@/stores/user'

type ProfileStepProps = {
  onCreated: (userId: string) => void
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ProfileStep({ onCreated }: ProfileStepProps) {
  const t = useTranslations()
  const createRegisteredUser = useUserStore((s) => s.createRegisteredUser)
  const isLoading = useUserStore((s) => s.isLoading)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const trimmedName = name.trim()
  const trimmedEmail = email.trim()
  const isValid = trimmedName.length > 0 && EMAIL_REGEX.test(trimmedEmail)

  async function handleSubmit() {
    if (!isValid) return
    const user = await createRegisteredUser(trimmedName, trimmedEmail)
    if (!user) {
      addToast({
        title: t('onboarding.step2.createFailed'),
        color: 'danger',
      })
      return
    }
    onCreated(user.id)
  }

  return (
    <StepShell
      currentStep={2}
      totalSteps={3}
      title={t('onboarding.step2.title')}
      description={t('onboarding.step2.description')}
      canSkip={false}
      primaryAction={
        <Button
          color="primary"
          className="min-h-11 rounded-xl px-4 text-body font-medium focus-visible:ring-2 focus-visible:ring-ring"
          isDisabled={!isValid}
          isLoading={isLoading}
          onPress={() => void handleSubmit()}
        >
          {t('common.next')}
        </Button>
      }
    >
      <div className="flex flex-col gap-3">
        <Input
          isRequired
          label={t('onboarding.step2.namePlaceholder')}
          value={name}
          onValueChange={setName}
          classNames={{
            ...compactInputClassNames,
            inputWrapper:
              'min-h-11 rounded-xl border border-border bg-background shadow-none data-[focus=true]:border-primary data-[focus=true]:ring-2 data-[focus=true]:ring-ring/30',
          }}
        />
        <Input
          isRequired
          type="email"
          label={t('onboarding.step2.emailPlaceholder')}
          value={email}
          onValueChange={setEmail}
          classNames={{
            ...compactInputClassNames,
            inputWrapper:
              'min-h-11 rounded-xl border border-border bg-background shadow-none data-[focus=true]:border-primary data-[focus=true]:ring-2 data-[focus=true]:ring-ring/30',
          }}
        />
      </div>
    </StepShell>
  )
}
