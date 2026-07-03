import React, { useState } from 'react'
import axios from 'axios'
import './EmailVerification.css'

const EmailVerification = ({ setemailverificationvisibility }) => {
    const token = localStorage.getItem("token");
    const [enteredOTP, setEnteredOTP] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [resendbuttonvisible, setresendbuttonvisible] = useState(true);
    const handleClick = async () => {
        try {
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

            setErrorMessage(res.data.message);
                setresendbuttonvisible(res.data.success);
     

            const res2 = await axios.get(
                `${import.meta.env.VITE_API_URL}/checkuserinfo`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res2.data.userEmailVerification === true) {
                setemailverificationvisibility(true);
            }

        } catch (err) {
            setErrorMessage(
                err.response?.data?.message || "Something went wrong"
            );
        }
    };
    const handleClickResendOTP = async () => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/resendOTP`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if(res.data.success === true){
            setresendbuttonvisible(res.data.success);
            }
            console.log("resend data of sucess",res.data.success);
        } catch (err) {
            setErrorMessage(
                err.response?.data?.message || "Something went wrong"
            );
        }
    };
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
                    <p style={{ color: resendbuttonvisible ? "green" : "red", marginTop: "20px" }} id='erroemsg'>{errorMessage}</p>

                </div>
                <div id='emailVerificationbtn'>
                    <button onClick={handleClick}>Verify</button>
                </div>
                {resendbuttonvisible === false && (
                    <div id='emailVerificationbtn'>
                        <button onClick={handleClickResendOTP}>Resend OTP</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default EmailVerification