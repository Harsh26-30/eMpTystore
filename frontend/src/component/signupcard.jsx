import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import './signupcard.css'

const signupcard = ({ setvalid }) => {
    const [username, setusername] = useState('')
    const [userdob, setuserdob] = useState('')
    const [usergender, setusergender] = useState('')
    const [useremail, setuseremail] = useState('')
    const [userpass, setuserpass] = useState('')
    const [userContact,setuserContact] = useState('')
    const navigate = useNavigate();



    const handlesubmit = async (e) => {
        e.preventDefault();
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/signup`, {
            name: username,
            email: useremail,
            phoneNo: userContact,
            dob: userdob,
            gender: usergender,
            pass: userpass
        })
        localStorage.setItem("token", res.data.token);
        if (res.data.valid === 'true') {
            navigate("/addAddress");
        }
    }
    const handleGender = (e) => {
        setusergender(e.target.value);
    };
    return (
        <div id='mainboxsignup'>
            <div style={{border:"3px solid white",borderRadius:"20px",height:"100%"}}>
                <h2>signup</h2>
                <form onSubmit={handlesubmit}>
                    {/* Name input */}
                    <fieldset style={{width:"90%",height:'50px',border:"none"}}>
                        <legend>Name</legend>
                        <input className='inputbox' type="text" onChange={(e) => { setusername(e.target.value) }} />

                    </fieldset>

                    {/* DOB input */}
                    <fieldset style={{width:"90%",height:'50px',border:"none"}}>
                        <legend>D O B</legend>
                        <input className='inputbox' type="date" onChange={(e) => { setuserdob(e.target.value) }} />
                    </fieldset>

                    {/* Gender input */}
                    <fieldset style={{width:"90%",height:'50px',border:"none",display:"flex",justifyContent:"space-evenly"}}>
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

                    <fieldset style={{width:"90%",height:'50px',border:"none"}}>
                        <legend>Contact</legend>
                        <input required className='inputbox' type="text" onChange={(e) => { setuserContact(e.target.value) }} />
                    </fieldset>

                    {/* Email input */}
                    <fieldset style={{width:"90%",height:'50px',border:"none"}}>
                        <legend>Email</legend>
                        <input required className='inputbox' type="text" onChange={(e) => { setuseremail(e.target.value) }} />
                    </fieldset>

                    {/* Password input */}
                    <fieldset style={{width:"90%",height:'50px',border:"none"}}>
                        <legend>Password</legend>
                        <input required className='inputbox' type="text" onChange={(e) => { setuserpass(e.target.value) }} />
                    </fieldset>
                    <button id='submitbtn' type='Submit'>submit</button>
                </form>
            </div>

        </div>
    )
}

export default signupcard
