import { ArrowRight, LockKeyhole } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AuthField } from '../components/account/AuthField'
import { Button } from '../components/ui/Button'
import { DEMO_EMAIL, DEMO_PASSWORD, useAuth } from '../state/auth-context'

export function SignInPage() {
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [redirectSignedIn] = useState(() => Boolean(user))
  const [email, setEmail] = useState(DEMO_EMAIL)
  const [password, setPassword] = useState(DEMO_PASSWORD)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (redirectSignedIn) return <Navigate to="/account" replace />

  async function submit(event: FormEvent) {
    event.preventDefault()
    const nextErrors: typeof errors = {}
    if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = 'Enter a valid email address.'
    if (password.length < 8) nextErrors.password = 'Password must be at least 8 characters.'
    setErrors(nextErrors)
    setFormError('')
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    try {
      await signIn(email, password)
      const destination = (location.state as { from?: string } | null)?.from ?? '/account'
      navigate(destination, { replace: true })
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to sign in right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page container">
      <section className="auth-card" aria-labelledby="sign-in-title">
        <header><p className="eyebrow">Welcome back</p><h1 id="sign-in-title">Sign in</h1><p>See your profile, saved address, and demo order history.</p></header>
        <div className="demo-credentials"><LockKeyhole aria-hidden="true" /><p><strong>Demo account</strong><span>{DEMO_EMAIL} · {DEMO_PASSWORD}</span></p></div>
        {formError && <div className="form-alert" role="alert">{formError}</div>}
        <form onSubmit={submit} noValidate>
          <AuthField label="Email" name="email" type="email" autoComplete="email" value={email} error={errors.email} onChange={(event) => { setEmail(event.target.value); setErrors((current) => ({ ...current, email: undefined })) }} />
          <AuthField label="Password" name="password" type="password" autoComplete="current-password" value={password} error={errors.password} onChange={(event) => { setPassword(event.target.value); setErrors((current) => ({ ...current, password: undefined })) }} />
          <Button className="auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : <>Sign in <ArrowRight aria-hidden="true" /></>}</Button>
        </form>
        <p className="auth-switch">New to Aster? <Link to="/create-account">Create an account</Link></p>
        <p className="demo-security-note">Demo only: there is no server session, password hashing, or identity verification. Never enter a real password.</p>
      </section>
    </div>
  )
}
