import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ensureGuestSession, type GuestSessionStatus } from './features/auth/guestSession'
import { Board } from './features/board/Board'

const queryClient = new QueryClient()

export default function App() {
  const [session, setSession] = useState<GuestSessionStatus>('pending')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true

    ensureGuestSession().then(
      () => {
        if (active) setSession('ready')
      },
      () => {
        if (active) setSession('error')
      },
    )

    return () => {
      active = false
    }
  }, [attempt])

  function retrySession() {
    setSession('pending')
    setAttempt((value) => value + 1)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Board sessionStatus={session} onRetrySession={retrySession} />
    </QueryClientProvider>
  )
}
