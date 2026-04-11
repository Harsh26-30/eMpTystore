import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import './logincard.css'


const logincard = ({ setvalid }) => {
  const [useremail, setuseremail] = useState('')
  const [userpass, setuserpass] = useState('')
  const navigate = useNavigate();


  const handlesubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
      email: useremail,
      pass: userpass
    })
    if (res.data.valid === 'true') {
      navigate("/home");
    }
    localStorage.setItem("token", res.data.token);

  }
  return (
    <div id='mainboxlogin'>
      <div style={{border:"3px solid white",borderRadius:"20px",height:"100%"}}>
        <h2>login</h2>
        <form onSubmit={handlesubmit}>
          <fieldset style={{ width: "90%", height: '50px', border: "none" }}>
            <legend>Email</legend>
            <input className='inputbox' type="text" onChange={(e) => { setuseremail(e.target.value) }} />
          </fieldset>

          <fieldset style={{ width: "90%", height: '50px', border: "none" }}>
            <legend>Password</legend>
            <input className='inputbox' type="text" onChange={(e) => { setuserpass(e.target.value) }} />
          </fieldset>

          <button id='submitbtn2' type='Submit'>submit</button>
        </form>
      </div>

    </div>
  )
}

export default logincard
