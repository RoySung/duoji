import { QueryClient } from '@tanstack/react-query'
import { useState } from 'react'

export function useAppQueryClient() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 10_000,
            gcTime: 60_000,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return queryClient
}
