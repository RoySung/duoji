import { Button } from '@heroui/button'
import { useRouter } from 'next/router'

function Login() {
  const router = useRouter()

  function onLogin() {
    console.log('onLogin')
    router.push('/')
  }

  return (
    <div
      id="login-page"
      className="flex h-screen w-full items-center justify-center bg-orange-400"
    >
      <div className="content flex flex-col items-center justify-center gap-3 rounded-lg bg-white p-8 shadow-lg">
        <h1>Duoji</h1>
        <Button color="primary" onPress={onLogin}>
          Login
        </Button>
      </div>
    </div>
  )
}

// setting getLayout
Login.getLayout = function getLayout(page: React.ReactNode) {
  return <>{page}</>
}

export default Login
