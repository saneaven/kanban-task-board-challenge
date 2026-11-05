import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ensureGuestSession } from './features/auth/guestSession'
import { Board } from './features/board/Board'

const queryClient = new QueryClient()

type SessionState =
  | { status: 'pending' }
  | { status: 'ready' }
  | { status: 'error'; message: string }

export default function App() {
  const [session, setSession] = useState<SessionState>({ status: 'pending' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true

    ensureGuestSession().then(
      () => {
        if (active) setSession({ status: 'ready' })
      },
      (error: unknown) => {
        if (active) {
          setSession({
            status: 'error',
            message: error instanceof Error ? error.message : 'Could not set up your guest session.',
          })
        }
      },
    )

    return () => {
      active = false
    }
  }, [attempt])

  return (
    <QueryClientProvider client={queryClient}>
      {session.status === 'pending' ? (
        <p role="status">Setting up your guest session…</p>
      ) : session.status === 'error' ? (
        <div role="alert">
          <p>{session.message}</p>
          <button
            type="button"
            onClick={() => {
              setSession({ status: 'pending' })
              setAttempt((value) => value + 1)
            }}
          >
            Retry
          </button>
        </div>
      ) : (
        <Board />
      )}
    </QueryClientProvider>
  )
}
