import { createContext, useContext } from 'react'

export const AUTH_STORAGE_KEY = 'aster-demo-account-v1'
export const DEMO_EMAIL = 'demo@aster.market'
export const DEMO_PASSWORD = 'demo1234'

export interface SavedAddress {
  label: string
  recipient: string
  street: string
  apartment: string
  city: string
  state: string
  postalCode: string
}

export interface DemoProfile {
  fullName: string
  email: string
  phone: string
  address?: SavedAddress
}

export interface AuthContextValue {
  user: DemoProfile | null
  signIn: (email: string, password: string) => Promise<void>
  createAccount: (profile: Pick<DemoProfile, 'fullName' | 'email'>, password: string) => Promise<void>
  updateProfile: (profile: Pick<DemoProfile, 'fullName' | 'phone'>) => Promise<void>
  saveAddress: (address: SavedAddress) => Promise<void>
  signOut: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
