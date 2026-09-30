import { Eye, EyeOff } from 'lucide-react'
import { useState, type InputHTMLAttributes } from 'react'

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function AuthField({ label, error, id, type, ...props }: AuthFieldProps) {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const fieldId = id ?? props.name
  const isPassword = type === 'password'

  return (
    <div className={`auth-field${error ? ' auth-field--error' : ''}`}>
      <label htmlFor={fieldId}>{label}</label>
      <div className="auth-field__control">
        <input
          id={fieldId}
          type={isPassword && passwordVisible ? 'text' : type}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setPasswordVisible((visible) => !visible)}
            aria-label={passwordVisible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          >
            {passwordVisible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
          </button>
        )}
      </div>
      {error && <small id={`${fieldId}-error`}>{error}</small>}
    </div>
  )
}
