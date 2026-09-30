import { type ReactNode, useMemo, useState } from 'react'
import {
  AUTH_STORAGE_KEY,
  AuthContext,
  DEMO_EMAIL,
  DEMO_PASSWORD,
  type AuthContextValue,
  type DemoProfile,
  type SavedAddress,
} from './auth-context'

interface StoredAccount {
  profile: DemoProfile
  signedIn: boolean
}

const demoProfile: DemoProfile = {
  fullName: 'Alex Morgan',
  email: DEMO_EMAIL,
  phone: '(512) 555-0142',
  address: {
    label: 'Home',
    recipient: 'Alex Morgan',
    street: '123 Market Street',
    apartment: 'Apt 4B',
    city: 'Austin',
    state: 'TX',
    postalCode: '78701',
  },
}

function readStoredAccount(): StoredAccount | null {
  try {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY)
    if (!stored) return null
    const parsed = JSON.parse(stored) as Partial<StoredAccount>
    if (!parsed.profile?.email || !parsed.profile.fullName) return null
    return { profile: parsed.profile, signedIn: Boolean(parsed.signedIn) }
  } catch {
    return null
  }
}

function persistAccount(profile: DemoProfile, signedIn: boolean) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ profile, signedIn }))
}

function delay() {
  return new Promise((resolve) => window.setTimeout(resolve, 450))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<StoredAccount | null>(readStoredAccount)

  const value = useMemo<AuthContextValue>(() => ({
    user: account?.signedIn ? account.profile : null,
    async signIn(email, password) {
      await delay()
      const normalizedEmail = email.trim().toLowerCase()
      const stored = readStoredAccount()
      const isSeededDemo = normalizedEmail === DEMO_EMAIL && password === DEMO_PASSWORD
      const isLocalAccount = stored?.profile.email.toLowerCase() === normalizedEmail && password.length >= 8
      if (!isSeededDemo && !isLocalAccount) throw new Error('Those demo credentials do not match an account in this browser.')
      const profile = isLocalAccount && stored ? stored.profile : demoProfile
      persistAccount(profile, true)
      setAccount({ profile, signedIn: true })
    },
    async createAccount(profile, password) {
      await delay()
      if (password.length < 8) throw new Error('Use at least 8 characters for the demo password.')
      const nextProfile: DemoProfile = { ...profile, phone: '' }
      persistAccount(nextProfile, true)
      setAccount({ profile: nextProfile, signedIn: true })
    },
    async updateProfile(profile) {
      await delay()
      if (!account) throw new Error('Sign in before updating your profile.')
      const nextProfile = { ...account.profile, ...profile }
      persistAccount(nextProfile, true)
      setAccount({ profile: nextProfile, signedIn: true })
    },
    async saveAddress(address: SavedAddress) {
      await delay()
      if (!account) throw new Error('Sign in before saving an address.')
      const nextProfile = { ...account.profile, address }
      persistAccount(nextProfile, true)
      setAccount({ profile: nextProfile, signedIn: true })
    },
    signOut() {
      if (account) persistAccount(account.profile, false)
      setAccount((current) => current ? { ...current, signedIn: false } : null)
    },
  }), [account])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
