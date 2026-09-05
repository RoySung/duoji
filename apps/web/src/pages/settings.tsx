import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
  useDisclosure,
} from '@heroui/react'
import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { PiMoonBold, PiSunBold } from 'react-icons/pi'
import { PageScaffold } from '@/components/ui/PageScaffold'
import { SurfaceCard } from '@/components/ui/SurfaceCard'
import {
  compactSelectClassNames,
  confirmModalClassNames,
} from '@/components/TransactionModal/formControlStyles'
import { useSettingsStore } from '@/stores/settings'
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/i18n/config'
import { resetAllData } from '@/lib/dexie'

export default function Settings() {
  const [hasHydrated, setHasHydrated] = useState(false)
  const { setTheme, theme } = useTheme()
  const t = useTranslations()

  const language = useSettingsStore((s) => s.language)
  const setLanguage = useSettingsStore((s) => s.setLanguage)

  const resetModal = useDisclosure()
  const [isResetting, setIsResetting] = useState(false)

  useEffect(() => {
    setHasHydrated(true)
  }, [])

  async function handleReset() {
    setIsResetting(true)
    try {
      await resetAllData()
      window.location.reload()
    } catch (error) {
      console.error('Failed to reset app data:', error)
      setIsResetting(false)
    }
  }

  const resolvedTheme = theme === 'dark' ? 'dark' : 'light'

  function handleThemeChange(isSelected: boolean) {
    setTheme(isSelected ? 'dark' : 'light')
  }

  function handleLanguageChange(value: string) {
    if (
      SUPPORTED_LOCALES.includes(value as SupportedLocale) &&
      value !== language
    ) {
      void setLanguage(value as SupportedLocale)
    }
  }

  return (
    <div
      id="settings-page"
      className="h-full overflow-y-auto bg-background text-foreground"
    >
      <PageScaffold>
        <header className="space-y-1.5">
          <p className="text-label font-medium text-emphasis-foreground">
            {t('settings.title')}
          </p>
          <h1 className="text-headline font-semibold text-foreground text-balance">
            {t('settings.heading')}
          </h1>
          <p className="max-w-[65ch] text-body text-muted-foreground text-pretty">
            {t('settings.subheading')}
          </p>
        </header>

        <SurfaceCard className="overflow-hidden p-0">
          <section className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="space-y-1">
              <h2 className="text-title font-semibold text-foreground">
                {t('settings.appearance.title')}
              </h2>
              <p className="text-body text-muted-foreground">
                {t('settings.appearance.description')}
              </p>
            </div>

            <Switch
              aria-label={t('settings.appearance.title')}
              className="min-h-11 shrink-0"
              isDisabled={!hasHydrated}
              isSelected={resolvedTheme === 'dark'}
              size="lg"
              thumbIcon={({ isSelected, className }) =>
                isSelected ? (
                  <PiMoonBold className={className} size={14} />
                ) : (
                  <PiSunBold className={className} size={14} />
                )
              }
              onValueChange={handleThemeChange}
            >
              {resolvedTheme === 'dark'
                ? t('settings.appearance.dark')
                : t('settings.appearance.light')}
            </Switch>
          </section>

          <div aria-hidden="true" className="h-px bg-border" />

          <section className="flex flex-col gap-4 px-5 py-5 sm:px-6">
            <div className="space-y-1">
              <h2 className="text-title font-semibold text-foreground">
                {t('settings.language.title')}
              </h2>
              <p className="text-body text-muted-foreground">
                {t('settings.language.description')}
              </p>
            </div>
            <Select
              aria-label={t('settings.language.label')}
              label={t('settings.language.label')}
              selectedKeys={[language]}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full sm:max-w-xs"
              classNames={compactSelectClassNames}
            >
              {SUPPORTED_LOCALES.map((locale) => (
                <SelectItem key={locale}>
                  {t(`settings.language.options.${locale}`)}
                </SelectItem>
              ))}
            </Select>
            <p className="text-label text-muted-foreground">
              {t('settings.language.helper')}
            </p>
          </section>
        </SurfaceCard>

        <SurfaceCard className="bg-danger/5 p-5 shadow-none ring-1 ring-inset ring-danger/25 sm:p-6">
          <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h2 className="text-title font-semibold text-danger">
                {t('settings.reset.title')}
              </h2>
              <p className="text-body text-muted-foreground">
                {t('settings.reset.description')}
              </p>
            </div>
            <Button
              className="min-h-11 w-full rounded-xl px-4 text-body sm:w-auto"
              color="danger"
              variant="flat"
              onPress={resetModal.onOpen}
              isDisabled={isResetting}
            >
              {t('settings.reset.action')}
            </Button>
          </section>
        </SurfaceCard>
      </PageScaffold>

      <Modal
        classNames={confirmModalClassNames}
        isOpen={resetModal.isOpen}
        onOpenChange={resetModal.onOpenChange}
        placement="center"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h2 className="text-title font-semibold text-foreground">
                  {t('settings.reset.confirmTitle')}
                </h2>
              </ModalHeader>
              <ModalBody>
                <p className="text-body text-muted-foreground text-pretty">
                  {t('settings.reset.confirmDescription')}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="min-h-11 rounded-xl text-body"
                  variant="light"
                  onPress={onClose}
                  isDisabled={isResetting}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  className="min-h-11 rounded-xl text-body"
                  color="danger"
                  onPress={handleReset}
                  isLoading={isResetting}
                >
                  {isResetting
                    ? t('settings.reset.resetting')
                    : t('settings.reset.confirmAction')}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
