import { isAuthSessionMissingError } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'

export type GuestSessionStatus = 'pending' | 'ready' | 'error'

let guestSessionPromise: Promise<void> | null = null

async function secureGuestSession(): Promise<void> {
  const { error } = await supabase.auth.getUser()

  if (!error) return

  if (error.code === 'user_not_found') {
    const { error: signOutError } = await supabase.auth.signOut({ scope: 'local' })
    if (signOutError) throw signOutError
  } else if (!isAuthSessionMissingError(error)) {
    throw error
  }

  const { data: guest, error: signInError } = await supabase.auth.signInAnonymously()
  if (signInError) throw signInError
  if (!guest.session) {
    throw new Error('Could not create your guest session.')
  }
}

export function ensureGuestSession(): Promise<void> {
  if (!guestSessionPromise) {
    guestSessionPromise = secureGuestSession().catch((error: unknown) => {
      guestSessionPromise = null
      throw error
    })
  }

  return guestSessionPromise
}
