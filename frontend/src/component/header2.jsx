import React from 'react'
import './header2.css'
import { useNavigate } from 'react-router-dom';


const header2 = () => {
  const navigate = useNavigate();
  return (
    <div id='mainboxheader2'>
      <img src="\E.png" alt="logo" />
      <div id='mainboxheader3'>
        <button onClick={(e) => { navigate("/Order"); }}>
          <img src="\list_alt_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png" alt="More" />
        </button>
        <button onClick={(e) => { navigate("/Menu"); }}>
          <img src="\menu_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png" alt="More" />
        </button>
      </div>
    </div>
  )
}

export default header2