import React from 'react'
import './numberverification.css'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const numberverification = () => {
    const [userphonenumber, setuserphonenumber] = useState()
    const [userOtp, setuserOtp] = useState()
    const navigate = useNavigate();

    const handlegetotp = async (e) => {
        e.preventDefault();
        await axios.post(`${import.meta.env.VITE_API_URL}/send-otp`, {
            phone: userphonenumber
        });
    }
    const handleverify = async (e) => {
        e.preventDefault();
        const res = await axios.post("http://localhost:3000/verify-otp", {
            phone: userphonenumber,
            otp: userOtp
        });
        if (res.verification === true) {
            navigate("/home");
        }
    }
    return (
        <div id='mainboxboss1'>
            <div id='mainboxnumberverification'>

                <div style={{ border: "3px solid white", borderRadius: "20px", height: "100%" }}>
                    <h2>Verify Phone Number</h2>
                    <form >
                        <fieldset style={{ width: "90%", height: '50px', border: "none" }}>
                            <legend>Phone No</legend>
                            <input className='inputbox' type="text" onChange={(e) => { setuserphonenumber(e.target.value) }} />
                        </fieldset>
                        <button id='submitbtn2' onClick={handlegetotp}>GET OTP</button>

                        <fieldset style={{ width: "90%", height: '50px', border: "none" }}>
                            <legend>OTP</legend>
                            <input className='inputbox' type="text" onChange={(e) => { setuserOtp(e.target.value) }} />
                        </fieldset>

                        <button id='submitbtn2' onClick={handleverify}>Verify</button>
                    </form>
                </div>
            </div>
        </div>

    )
}

export default numberverification