import { Button } from '@heroui/button'
import { useRouter } from 'next/router'
import { PiMapPinAreaFill } from 'react-icons/pi'

import EntryShell from '@/components/onboarding/EntryShell'
import { SurfaceCard } from '@/components/ui/SurfaceCard'

function Login() {
  const router = useRouter()

  function onLogin() {
    void router.push('/')
  }

  return (
    <div id="login-page" className="w-full py-6" data-ui="login-page">
      <SurfaceCard className="content mx-auto flex w-full max-w-md flex-col items-center gap-5 border border-border bg-card p-6 text-center shadow-none sm:p-8">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-peach text-emphasis-foreground">
          <PiMapPinAreaFill className="size-6" aria-hidden="true" />
        </span>
        <div className="space-y-2">
          <h1 className="text-headline font-semibold">Duoji</h1>
        </div>
        <Button
          color="primary"
          className="min-h-11 w-full rounded-xl px-4 text-body font-medium focus-visible:ring-2 focus-visible:ring-ring"
          onPress={onLogin}
        >
          Login
        </Button>
      </SurfaceCard>
    </div>
  )
}

// setting getLayout
Login.getLayout = function getLayout(page: React.ReactNode) {
  return <EntryShell>{page}</EntryShell>
}

export default Login
