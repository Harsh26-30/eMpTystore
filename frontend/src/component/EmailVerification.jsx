import React from 'react'
import './EmailVerification.css'

const EmailVerification = () => {
    return (
        <div id='mainboxemailVerification'>
            <div id='emailVerificationbox2'>
                <h3>Email Verification</h3>
                <p>An OTP Has Been Sent To Your Email</p>
                <div id='inputboxemailVerification'>
                    <input type="text" placeholder="Enter verification OTP" />
                </div>
                <div id='emailVerificationbtn'>
                    <button>Verify</button>

                </div>
            </div>
        </div>
    )
}

export default EmailVerification