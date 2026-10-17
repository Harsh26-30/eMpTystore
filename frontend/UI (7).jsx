import { useId, useState } from 'react'

// One labelled input. Pass type="password" to get a Show/Hide button.
const AuthField = ({ label, hint, type = 'text', className = '', error, ...inputProps }) => {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const [revealed, setRevealed] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className={`auth-field ${className}`}>
      <label className="auth-label" htmlFor={id}>{label}</label>
      <div className="auth-input-wrap">
        <input
          id={id}
          className={isPassword ? 'auth-input has-reveal' : 'auth-input'}
          type={isPassword && revealed ? 'text' : type}
          aria-describedby={hintId}
          aria-invalid={error ? 'true' : undefined}
          {...inputProps}
        />
        {isPassword && (
          <button
            type="button"
            className="auth-reveal"
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? 'Hide password' : 'Show password'}
          >
            {revealed ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {hint && <span id={hintId} className="auth-hint">{hint}</span>}
    </div>
  )
}

export default AuthField
