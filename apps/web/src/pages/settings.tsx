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
      <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col gap-8 px-4 py-8">
        <section className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange-300">
            {t('settings.title')}
          </p>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {t('settings.heading')}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              {t('settings.subheading')}
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-4 shadow-lg shadow-black/5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-foreground">
                {t('settings.appearance.title')}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t('settings.appearance.description')}
              </p>
            </div>

            <Switch
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
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-4 shadow-lg shadow-black/5">
          <div className="flex flex-col gap-3">
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-foreground">
                {t('settings.language.title')}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t('settings.language.description')}
              </p>
            </div>
            <Select
              aria-label={t('settings.language.label')}
              label={t('settings.language.label')}
              selectedKeys={[language]}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="max-w-xs"
            >
              {SUPPORTED_LOCALES.map((locale) => (
                <SelectItem key={locale}>{t(`settings.language.options.${locale}`)}</SelectItem>
              ))}
            </Select>
            <p className="text-xs text-muted-foreground">{t('settings.language.helper')}</p>
          </div>
        </section>

        <section className="rounded-3xl border border-danger/40 bg-card p-4 shadow-lg shadow-black/5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-danger">
                {t('settings.reset.title')}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t('settings.reset.description')}
              </p>
            </div>
            <Button
              color="danger"
              variant="flat"
              onPress={resetModal.onOpen}
              isDisabled={isResetting}
            >
              {t('settings.reset.action')}
            </Button>
          </div>
        </section>
      </div>

      <Modal
        isOpen={resetModal.isOpen}
        onOpenChange={resetModal.onOpenChange}
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{t('settings.reset.confirmTitle')}</ModalHeader>
              <ModalBody>
                <p className="text-sm text-muted-foreground">
                  {t('settings.reset.confirmDescription')}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={onClose}
                  isDisabled={isResetting}
                >
                  {t('common.cancel')}
                </Button>
                <Button
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
