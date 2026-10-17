import React, { useState } from 'react'
import axios from 'axios'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthField from './AuthField'

const Logincard = () => {
  const [useremail, setuseremail] = useState('')
  const [userpass, setuserpass] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handlesubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
        email: useremail,
        pass: userpass
      })

      if (res.data.valid === 'true') {
        // store the token first, then go back to where the person was heading
        localStorage.setItem('token', res.data.token)
        const from = location.state?.from?.pathname || '/home'
        navigate(from, { replace: true })
      } else {
        setError(res.data.msg || 'We could not log you in. Please try again.')
      }
    } catch (err) {
      console.log(err)
      setError('We could not reach the server. Check your internet connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h2 className="auth-title">Welcome back</h2>
      <p className="auth-lead">Log in to see shops near you and your orders.</p>

      <form className="auth-form" onSubmit={handlesubmit}>
        <AuthField
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          required
          value={useremail}
          onChange={(e) => setuseremail(e.target.value)}
        />

        <AuthField
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Your password"
          required
          value={userpass}
          onChange={(e) => setuserpass(e.target.value)}
        />

        {error && <p className="auth-error" role="alert">{error}</p>}

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? 'Logging in…' : 'Log in'}
        </button>

        <Link className="auth-link" to="/ForgotPassword">Forgot your password?</Link>
      </form>
    </>
  )
}

export default Logincard
