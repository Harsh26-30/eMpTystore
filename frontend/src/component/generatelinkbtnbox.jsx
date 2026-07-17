import React from 'react'
import "./generatelinkbtnbox.css"
import { useNavigate } from 'react-router-dom'

const generatelinkbtnbox = () => {
    const navigate = useNavigate()
  return (
    <div id='generatelinkbtnboxmainbox'>
       <button onClick={() => navigate("/shareAndEarn")}>Proceed to Share & Earn</button> 
    </div>
  )
}

export default generatelinkbtnbox