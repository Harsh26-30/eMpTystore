import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import AuthLayout from './AuthLayout'
import Logincard from './logincard'
import Signupcard from './signupcard'

const Auth = ({ setvalid }) => {
  const [searchParams] = useSearchParams()
  // Someone arriving from a share link is new, so open on sign up.
  // Everyone else is most likely coming back, so open on log in.
  const [mode, setMode] = useState(searchParams.get('id') ? 'signup' : 'welcome')

  if (mode === 'welcome') {
    return (
      <div className="wl-hero">
        <div className="wl-mark" aria-hidden="true">
          <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#1A62E6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l1.5-5h15L21 9" /><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" /><path d="M5 12v8h14v-8" /><path d="M10 20v-5h4v5" /></svg>
        </div>
        <div className="wl-copy">
          <h1>Local Stores.<br />Real Products.<br />Closer to You.</h1>
          <p>Find what you need, check availability in nearby stores, and save time.</p>
        </div>
        <div className="wl-actions">
          <button type="button" className="wl-primary" onClick={() => setMode('signup')}>Get started</button>
          <button type="button" className="wl-link" onClick={() => setMode('login')}>Log in</button>
        </div>
      </div>
    )
  }

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
