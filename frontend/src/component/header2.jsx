import React from 'react'
import './header2.css'
import { useNavigate } from 'react-router-dom';


const header2 = () => {
  const navigate = useNavigate();
  return (
    <div id='mainboxheader2'>
      <img src="\E.png" alt="logo" />
      <button onClick={(e) => { navigate("/Menu"); }}>
        <img src="\src\assets\menu_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png" alt="More" />
      </button>
    </div>
  )
}

export default header2