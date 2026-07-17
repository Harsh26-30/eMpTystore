import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import './signupcard.css'
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

const Signupcard = ({ setvalid }) => {
    const [username, setusername] = useState('')
    const [userdob, setuserdob] = useState('')
    const [usergender, setusergender] = useState('')
    const [useremail, setuseremail] = useState('')
    const [userpass, setuserpass] = useState('')
    const [userContact, setuserContact] = useState('')
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const referralId = searchParams.get("ref");
    const referralName = searchParams.get("username");

    useEffect(() => {
        if (referralId) {
            localStorage.setItem("referralId", referralId);
        }

        if (referralName) {
            localStorage.setItem("referralName", referralName);
        }
    }, [referralId, referralName]);

    const handlesubmit = async (e) => {
        e.preventDefault();

        const referralId = localStorage.getItem("referralId");

        const res = await axios.post(`${import.meta.env.VITE_API_URL}/signup`, {
            name: username,
            email: useremail,
            phoneNo: userContact,
            dob: userdob,
            gender: usergender,
            pass: userpass,
            referralId
        });

        localStorage.setItem("token", res.data.token);
        alert(res.data.message);

        if (res.data.valid === "true") {
            localStorage.removeItem("referralId");
            localStorage.removeItem("referralName");
            navigate("/addAddress");
        }
    };

    const handleGender = (e) => {
        setusergender(e.target.value);
    };
    return (
        <div id='mainboxsignup'>
            <div style={{ border: "3px solid white", borderRadius: "20px", height: "100%" }}>
                <h2>signup</h2>
                <form onSubmit={handlesubmit}>
                    {/* Name input */}
                    <fieldset style={{ width: "90%", height: '50px', border: "none" }}>
                        <legend>Name</legend>
                        <input className='inputbox' type="text" onChange={(e) => { setusername(e.target.value) }} />

                    </fieldset>

                    {/* DOB input */}
                    <fieldset style={{ width: "90%", height: '50px', border: "none" }}>
                        <legend>D O B</legend>
                        <input className='inputbox' type="date" onChange={(e) => { setuserdob(e.target.value) }} />
                    </fieldset>

                    {/* Gender input */}
                    <fieldset style={{ width: "90%", height: '50px', border: "none", display: "flex", justifyContent: "space-evenly" }}>
                        <legend>Gender</legend>
                        <label>
                            <input
                                type="radio"
                                name="gender"          // ✅ IMPORTANT (same name)
                                value="male"
                                checked={usergender === "male"}
                                onChange={handleGender}
                            />
                            Male
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={usergender === "female"}
                                onChange={handleGender}
                            />
                            Female
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="other"
                                checked={usergender === "other"}
                                onChange={handleGender}
                            />
                            Other
                        </label>
                    </fieldset>

                    <fieldset style={{ width: "90%", height: '50px', border: "none" }}>
                        <legend>Contact</legend>
                        <input required className='inputbox' type="text" onChange={(e) => { setuserContact(e.target.value) }} />
                    </fieldset>

                    {/* Email input */}
                    <fieldset style={{ width: "90%", height: '50px', border: "none" }}>
                        <legend>Email</legend>
                        <input required className='inputbox' type="text" onChange={(e) => { setuseremail(e.target.value) }} />
                    </fieldset>

                    {/* Password input */}
                    <fieldset style={{ width: "90%", height: '50px', border: "none" }}>
                        <legend>Password</legend>
                        <input required className='inputbox' type="text" onChange={(e) => { setuserpass(e.target.value) }} />
                    </fieldset>
                    <button id='submitbtn' type='Submit'>submit</button>
                </form>
            </div>

        </div>
    )
}

export default Signupcard
