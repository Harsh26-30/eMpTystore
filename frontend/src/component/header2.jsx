import React from 'react'
import './header2.css'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios'



const header2 = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [userRole, setuserRole] = useState('')



  useEffect(() => {
    if (!token) return;

    const fun1 = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/checkuserinfo`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setuserRole(res.data.role);
        setkey(res.data.pickup_location);
      } catch (err) {
        console.log(err);
      }
    };

    fun1();
  }, [token]);
  return (
    <div id='mainboxheader2'>
      <img src="\E.png" alt="logo" />
      <div id='mainboxheader3'>
        {(userRole === 'Seller') && (<button onClick={(e) => { navigate("/Order"); }}>
          <img src="\list_alt_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png" alt="More" />
        </button>)}
        <button onClick={(e) => { navigate("/Menu"); }}>
          <img src="\menu_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png" alt="More" />
        </button>
      </div>
    </div>
  )
}

export default header2