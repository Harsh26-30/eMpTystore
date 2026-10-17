import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from './AuthLayout'
import AuthField from './AuthField'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [dob, setDob] = useState('')
  const [newpassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const today = new Date().toISOString().split('T')[0]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/updatepassword`, {
        email, dob, newpassword
      })

      if (res.data.success) {
        setDone(true)
        setTimeout(() => navigate('/Auth', { replace: true }), 2000)
      } else {
        setError(res.data.message || 'We could not change your password. Please try again.')
      }
    } catch (err) {
      console.log(err)
      setError('We could not reach the server. Check your internet connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <AuthLayout>
        <h2 className="auth-title">Password changed</h2>
        <p className="auth-lead">Taking you back to log in with your new password.</p>
        <Link className="auth-link" to="/Auth">Go to log in now</Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <h2 className="auth-title">Reset your password</h2>
      <p className="auth-lead">Enter your email and date of birth, then choose a new password.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthField
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <AuthField
          label="Date of birth"
          type="date"
          name="dob"
          max={today}
          required
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />

        <AuthField
          label="New password"
          type="password"
          name="new-password"
          autoComplete="new-password"
          placeholder="Choose a new password"
          hint="At least 6 characters"
          required
          minLength={6}
          value={newpassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        {error && <p className="auth-error" role="alert">{error}</p>}

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? 'Saving…' : 'Change password'}
        </button>

        <Link className="auth-link" to="/Auth">Back to log in</Link>
      </form>
    </AuthLayout>
  )
}

export default ForgotPassword
