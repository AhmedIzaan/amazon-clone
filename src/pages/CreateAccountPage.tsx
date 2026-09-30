import { ArrowRight, ShieldAlert } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AuthField } from '../components/account/AuthField'
import { Button } from '../components/ui/Button'
import { useAuth } from '../state/auth-context'

export function CreateAccountPage() {
  const { user, createAccount } = useAuth()
  const navigate = useNavigate()
  const [redirectSignedIn] = useState(() => Boolean(user))
  const [values, setValues] = useState({ fullName: '', email: '', password: '', confirmation: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof typeof values, string>>>({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (redirectSignedIn) return <Navigate to="/account" replace />

  function update(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    const nextErrors: typeof errors = {}
    if (values.fullName.trim().length < 2) nextErrors.fullName = 'Enter your full name.'
    if (!/^\S+@\S+\.\S+$/.test(values.email)) nextErrors.email = 'Enter a valid email address.'
    if (values.password.length < 8) nextErrors.password = 'Use at least 8 characters.'
    if (values.confirmation !== values.password) nextErrors.confirmation = 'Passwords do not match.'
    setErrors(nextErrors)
    setFormError('')
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    try {
      await createAccount({ fullName: values.fullName.trim(), email: values.email.trim().toLowerCase() }, values.password)
      navigate('/account', { replace: true })
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to create the demo account.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page container">
      <section className="auth-card" aria-labelledby="create-account-title">
        <header><p className="eyebrow">Aster account</p><h1 id="create-account-title">Create account</h1><p>Keep your demo profile, address, and local orders together.</p></header>
        <div className="demo-credentials demo-credentials--warning"><ShieldAlert aria-hidden="true" /><p><strong>Use made-up details</strong><span>This prototype stores profile data only in this browser.</span></p></div>
        {formError && <div className="form-alert" role="alert">{formError}</div>}
        <form onSubmit={submit} noValidate>
          <AuthField label="Full name" name="fullName" autoComplete="name" value={values.fullName} error={errors.fullName} onChange={(event) => update('fullName', event.target.value)} />
          <AuthField label="Email" name="email" type="email" autoComplete="email" value={values.email} error={errors.email} onChange={(event) => update('email', event.target.value)} />
          <AuthField label="Password" name="newPassword" type="password" autoComplete="new-password" value={values.password} error={errors.password} onChange={(event) => update('password', event.target.value)} />
          <AuthField label="Confirm password" name="confirmation" type="password" autoComplete="new-password" value={values.confirmation} error={errors.confirmation} onChange={(event) => update('confirmation', event.target.value)} />
          <Button className="auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating account…' : <>Create demo account <ArrowRight aria-hidden="true" /></>}</Button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/sign-in">Sign in</Link></p>
        <p className="demo-security-note">Passwords are validated for the demo but deliberately never stored. This is not production authentication.</p>
      </section>
    </div>
  )
}
