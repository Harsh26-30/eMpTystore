import React, { useState } from 'react'
import './forgotPassword.css'
import axios from 'axios';
import { useNavigate } from "react-router-dom";


const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [newpassword, setNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/updatepassword`, {
      email, dob, newpassword
    });
    alert(res.data.message);
    navigate(-1);
  }

  return (
    <div id='mainboxforgotPassword'>
      <div id='box2forgotPassword'>
        <form onSubmit={handleSubmit}>
          <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder='Enter your email' />
          <input type="date" onChange={(e) => setDob(e.target.value)} placeholder='Enter your DOB' />
          <input type="password" onChange={(e) => setNewPassword(e.target.value)} placeholder='Enter your New Password' />
          <button type='submit'>Update-Password</button>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword