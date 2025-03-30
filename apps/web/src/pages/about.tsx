import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Button as NextButton } from '@heroui/button'

export default function About() {
  return (
    <div className="bg-gray-400">
      <Button variant="destructive">Click Me</Button>
      <NextButton color="primary">Click Me !!</NextButton>
      <h1 className="text-xl">About</h1>
      <p>This is the about page</p>
      <Link href="/posts">posts</Link>
    </div>
  )
}
