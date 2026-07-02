import React, { useState } from 'react'
import axios from 'axios'
import './EmailVerification.css'

const EmailVerification = ({ setemailverificationvisibility }) => {
    const token = localStorage.getItem("token");
    const [enteredOTP, setEnteredOTP] = useState('');
    const [errorMessage, setErrorMessage] = useState('');   
    const handleClick = async () => {
        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/verifyOTP`,
            {
                otp: enteredOTP
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        console.log(res.data);
        setemailverificationvisibility(res.data.sucess);
        setErrorMessage(res.data.message);
    }
    return (
        <div id='mainboxemailVerification'>
            <div id='emailVerificationbox2'>
                <h3>Email Verification</h3>
                <p>An OTP Has Been Sent To Your Email</p>
                <div id='inputboxemailVerification'>
                    <input
                        type="text"
                        placeholder="Enter verification OTP"
                        value={enteredOTP}
                        onChange={(e) => setEnteredOTP(e.target.value)}
                    />
                </div>
                <div id='emailVerificationbtn'>
                    <button onClick={handleClick}>Verify</button>
                </div>
                <p id='erroemsg'>{errorMessage}</p>
            </div>
        </div>
    )
}

export default EmailVerification