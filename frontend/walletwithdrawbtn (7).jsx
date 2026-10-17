import React, { useState } from 'react'
import axios from 'axios'
import './modal.css'

const UpdatePhoneNo = ({ fun1 }) => {
    const token = localStorage.getItem('token')
    const [phoneNo, setPhoneNo] = useState('')
    const [error, setError] = useState('')
    const [busy, setBusy] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (phoneNo.length !== 10) {
            setError('Enter a 10-digit mobile number.')
            return
        }

        setError('')
        setBusy(true)
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/updatePhoneNo`,
                { phoneNo },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            await fun1()
        } catch (err) {
            console.log(err)
            setError(err.response?.data?.message || 'We could not save your number. Check your connection and try again.')
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="modal-backdrop">
            <div className="modal" role="dialog" aria-modal="true" aria-labelledby="phone-update-title">
                <h2 id="phone-update-title">Update your phone number</h2>
                <p>The number on your account was reported as wrong. Enter a correct 10-digit mobile number to keep using Empty Store.</p>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="modal-field">
                        <label htmlFor="phone-update-input">Mobile number</label>
                        <input
                            id="phone-update-input"
                            type="tel"
                            inputMode="numeric"
                            autoComplete="tel"
                            maxLength={10}
                            placeholder="10-digit number"
                            value={phoneNo}
                            onChange={(e) => setPhoneNo(e.target.value)}
                        />
                    </div>

                    {error && <p className="modal-error" role="alert">{error}</p>}

                    <button className="modal-primary" type="submit" disabled={busy}>
                        {busy ? 'Saving…' : 'Save number'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default UpdatePhoneNo
