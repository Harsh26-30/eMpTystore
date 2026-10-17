import React, { useState } from 'react'
import axios from 'axios'
import './modal.css'

const EmailVerification = ({ setemailverificationvisibility }) => {
    const token = localStorage.getItem('token')
    const [enteredOTP, setEnteredOTP] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [resendbuttonvisible, setresendbuttonvisible] = useState(true)
    const [busy, setBusy] = useState(false)

    const handleClick = async (e) => {
        e.preventDefault()
        setBusy(true)
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/verifyOTP`,
                { otp: enteredOTP },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            setErrorMessage(res.data.message)
            setresendbuttonvisible(res.data.success)

            const res2 = await axios.get(
                `${import.meta.env.VITE_API_URL}/checkuserinfo`,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            if (res2.data.userEmailVerification === true) {
                setemailverificationvisibility(true)
            }
        } catch (err) {
            setErrorMessage(err.response?.data?.message || 'Something went wrong. Please try again.')
        } finally {
            setBusy(false)
        }
    }

    const handleClickResendOTP = async () => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/resendOTP`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            )
            if (res.data.success === true) {
                setresendbuttonvisible(res.data.success)
                setErrorMessage(res.data.message)
            }
        } catch (err) {
            setErrorMessage(err.response?.data?.message || 'Something went wrong. Please try again.')
        }
    }

    return (
        <div className="modal-backdrop">
            <div className="modal" role="dialog" aria-modal="true" aria-labelledby="email-verify-title">
                <h2 id="email-verify-title">Verify your email</h2>
                <p>We sent a 6-digit code to your email. Enter it below to continue.</p>

                <form className="modal-form" onSubmit={handleClick}>
                    <div className="modal-field">
                        <label htmlFor="email-verify-otp">Verification code</label>
                        <input
                            id="email-verify-otp"
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                            placeholder="6-digit code"
                            value={enteredOTP}
                            onChange={(e) => setEnteredOTP(e.target.value)}
                        />
                    </div>

                    {errorMessage && (
                        <p className={resendbuttonvisible === true ? 'modal-ok' : 'modal-error'} role="status">
                            {errorMessage}
                        </p>
                    )}

                    <button className="modal-primary" type="submit" disabled={busy || !enteredOTP.trim()}>
                        {busy ? 'Checking…' : 'Verify email'}
                    </button>
                </form>

                {resendbuttonvisible === false && (
                    <button className="modal-secondary" type="button" onClick={handleClickResendOTP}>
                        Send a new code
                    </button>
                )}
            </div>
        </div>
    )
}

export default EmailVerification
