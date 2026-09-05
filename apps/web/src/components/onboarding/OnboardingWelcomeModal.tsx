import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from '@heroui/react'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
import {
  PiChartPieSlice,
  PiNotePencil,
  PiSparkle,
  PiUsersThree,
} from 'react-icons/pi'
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
    void router.replace({ pathname: router.pathname, query: rest }, undefined, {
      shallow: true,
    })
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
        backdrop: 'bg-foreground/45',
        base: 'mx-4 max-h-[calc(100dvh-2rem)] rounded-2xl border border-border bg-card text-card-foreground shadow-[0_8px_24px_hsl(var(--surface-shadow)/0.3)] sm:mx-auto',
        body: 'overflow-y-auto',
      }}
    >
      <ModalContent>
        <ModalBody className="px-5 pb-2 pt-6 sm:px-8 sm:pt-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-peach text-emphasis-foreground">
              <PiSparkle className="size-6" aria-hidden />
            </div>
            <p className="text-label font-medium text-emphasis-foreground">
              {t('onboarding.welcome.eyebrow')}
            </p>
            <h2 className="text-title font-semibold">
              {t('onboarding.welcome.title')}
            </h2>
            <p className="whitespace-pre-line break-words text-body text-muted-foreground">
              {t('onboarding.welcome.description')}
            </p>
          </div>

          <ul className="mt-6 divide-y divide-border rounded-2xl bg-secondary/70 px-3">
            {HIGHLIGHTS.map(({ icon: Icon, titleKey, descriptionKey }) => (
              <li
                key={titleKey}
                className="flex min-w-0 items-start gap-3 py-3"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-card text-primary">
                  <Icon className="size-4" aria-hidden />
                </span>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="text-body font-medium">{t(titleKey)}</p>
                  <p className="break-words text-label leading-5 text-muted-foreground">
                    {t(descriptionKey)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </ModalBody>
        <ModalFooter className="px-5 pb-5 pt-4 sm:px-8 sm:pb-7">
          <Button
            color="primary"
            onPress={handleClose}
            className="min-h-11 w-full rounded-xl px-4 text-body font-medium focus-visible:ring-2 focus-visible:ring-ring"
            size="lg"
          >
            {t('onboarding.welcome.cta')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
