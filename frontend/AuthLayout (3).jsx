import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AuthField from './AuthField'

const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' }
]

const Signupcard = () => {
  const [username, setusername] = useState('')
  const [userdob, setuserdob] = useState('')
  const [usergender, setusergender] = useState('')
  const [useremail, setuseremail] = useState('')
  const [userpass, setuserpass] = useState('')
  const [userContact, setuserContact] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const referralId = searchParams.get('id')
  const referralName = searchParams.get('name')

  useEffect(() => {
    if (referralId) {
      localStorage.setItem('referralId', referralId)
    }
    if (referralName) {
      localStorage.setItem('referralName', referralName)
    }
  }, [referralId, referralName])

  const invitedBy = referralName || localStorage.getItem('referralName')
  const today = new Date().toISOString().split('T')[0]

  const handlesubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/signup`, {
        name: username,
        email: useremail,
        phoneNo: userContact,
        dob: userdob,
        gender: usergender,
        pass: userpass,
        referralId: localStorage.getItem('referralId')
      })

      if (res.data.valid === 'true') {
        // only keep a token when the account was really created
        localStorage.setItem('token', res.data.token)
        localStorage.removeItem('referralId')
        localStorage.removeItem('referralName')
        navigate('/addAddress')
      } else {
        setError(res.data.message || 'We could not create your account. Please try again.')
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
      <h2 className="auth-title">Create your account</h2>
      <p className="auth-lead">It takes about a minute. You will add your delivery address next.</p>

      {invitedBy && (
        <p className="auth-notice" style={{ marginBottom: 18 }}>
          {invitedBy} invited you to Empty Store.
        </p>
      )}

      <form className="auth-form" onSubmit={handlesubmit}>
        <div className="auth-grid is-two">
          <AuthField
            className="is-wide"
            label="Full name"
            name="name"
            autoComplete="name"
            placeholder="Your name"
            hint="3 to 20 letters"
            required
            minLength={3}
            maxLength={20}
            pattern="[A-Za-z ]{3,20}"
            title="Use 3 to 20 letters and spaces only"
            value={username}
            onChange={(e) => setusername(e.target.value)}
          />

          <AuthField
            label="Mobile number"
            type="tel"
            name="phone"
            autoComplete="tel"
            inputMode="numeric"
            placeholder="Mobile number"
            required
            value={userContact}
            onChange={(e) => setuserContact(e.target.value)}
          />

          <AuthField
            label="Date of birth"
            type="date"
            name="dob"
            autoComplete="bday"
            max={today}
            required
            value={userdob}
            onChange={(e) => setuserdob(e.target.value)}
          />

          <AuthField
            className="is-wide"
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
            className="is-wide"
            label="Password"
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="Choose a password"
            hint="At least 6 characters"
            required
            minLength={6}
            value={userpass}
            onChange={(e) => setuserpass(e.target.value)}
          />

          <fieldset className="auth-field is-wide" style={{ border: 'none' }}>
            <legend className="auth-label" style={{ marginBottom: 6 }}>Gender (optional)</legend>
            <div className="auth-choices">
              {GENDERS.map((g) => (
                <label className="auth-choice" key={g.value}>
                  <input
                    type="radio"
                    name="gender"
                    value={g.value}
                    checked={usergender === g.value}
                    onChange={(e) => setusergender(e.target.value)}
                  />
                  <span>{g.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {error && <p className="auth-error" role="alert">{error}</p>}

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </>
  )
}

export default Signupcard
