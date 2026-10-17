import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import AuthLayout from './AuthLayout'
import Logincard from './logincard'
import Signupcard from './signupcard'

const Auth = ({ setvalid }) => {
  const [searchParams] = useSearchParams()
  // Someone arriving from a share link is new, so open on sign up.
  // Everyone else is most likely coming back, so open on log in.
  const [mode, setMode] = useState(searchParams.get('id') ? 'signup' : 'login')

  return (
    <AuthLayout>
      <div className="auth-tabs" role="tablist" aria-label="Log in or create an account">
        <button
          type="button"
          role="tab"
          className="auth-tab"
          aria-selected={mode === 'login'}
          onClick={() => setMode('login')}
        >
          Log in
        </button>
        <button
          type="button"
          role="tab"
          className="auth-tab"
          aria-selected={mode === 'signup'}
          onClick={() => setMode('signup')}
        >
          Create account
        </button>
      </div>

      {mode === 'login' && <Logincard setvalid={setvalid} />}
      {mode === 'signup' && <Signupcard setvalid={setvalid} />}
    </AuthLayout>
  )
}

export default Auth
