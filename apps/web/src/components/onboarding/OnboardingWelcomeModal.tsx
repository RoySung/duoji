import { Button, Modal, ModalBody, ModalContent, ModalFooter } from '@heroui/react'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
import { PiChartPieSlice, PiNotePencil, PiSparkle, PiUsersThree } from 'react-icons/pi'
import type { ComponentType } from 'react'
import { useSettingsStore } from '@/stores/settings'

type Highlight = {
  icon: ComponentType<{ className?: string }>
  titleKey: string
  descriptionKey: string
}

const HIGHLIGHTS: Highlight[] = [
  {
    icon: PiNotePencil,
    titleKey: 'onboarding.welcome.highlights.log.title',
    descriptionKey: 'onboarding.welcome.highlights.log.description',
  },
  {
    icon: PiUsersThree,
    titleKey: 'onboarding.welcome.highlights.split.title',
    descriptionKey: 'onboarding.welcome.highlights.split.description',
  },
  {
    icon: PiChartPieSlice,
    titleKey: 'onboarding.welcome.highlights.insights.title',
    descriptionKey: 'onboarding.welcome.highlights.insights.description',
  },
]

export default function OnboardingWelcomeModal() {
  const router = useRouter()
  const t = useTranslations()
  const markOnboardingComplete = useSettingsStore(
    (s) => s.markOnboardingComplete
  )
  const isOpen = router.query.onboarding === 'welcome'

  async function handleClose() {
    await markOnboardingComplete()
    const { onboarding: _omit, ...rest } = router.query
    void router.replace(
      { pathname: router.pathname, query: rest },
      undefined,
      { shallow: true }
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      placement="center"
      hideCloseButton
      isDismissable={false}
      isKeyboardDismissDisabled
      size="md"
      scrollBehavior="inside"
      classNames={{
        base: 'mx-4 sm:mx-auto',
      }}
    >
      <ModalContent>
        <ModalBody className="px-6 pt-8 pb-2 sm:px-8 sm:pt-10">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <PiSparkle className="h-8 w-8" aria-hidden />
            </div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
              {t('onboarding.welcome.eyebrow')}
            </p>
            <h2 className="text-2xl font-semibold leading-tight">
              {t('onboarding.welcome.title')}
            </h2>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {t('onboarding.welcome.description')}
            </p>
          </div>

          <ul className="mt-6 flex flex-col gap-3">
            {HIGHLIGHTS.map(({ icon: Icon, titleKey, descriptionKey }) => (
              <li
                key={titleKey}
                className="flex items-start gap-3 rounded-xl border border-default-100 bg-default-50/60 p-3"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium">{t(titleKey)}</p>
                  <p className="text-xs text-muted-foreground">
                    {t(descriptionKey)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </ModalBody>
        <ModalFooter className="px-6 pb-6 pt-4 sm:px-8">
          <Button
            color="primary"
            onPress={handleClose}
            className="w-full"
            size="lg"
          >
            {t('onboarding.welcome.cta')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
