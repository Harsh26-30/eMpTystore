import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import './logincard.css'


const Logincard = () => {
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
    }else{
      alert(res.data.msg);
    }
    localStorage.setItem("token", res.data.token);

  }

    const handleforgotpassword = async (e) => {
    e.preventDefault();
    navigate("/ForgotPassword")
    alert("Click")
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

        <button style={{backgroundColor:"black",
          color:"white",
          textDecoration:"Underline",
          border:"none"}} 
          onClick={handleforgotpassword}>Forgot Password</button>
      </div>

    </div>
  )
}

export default Logincard
