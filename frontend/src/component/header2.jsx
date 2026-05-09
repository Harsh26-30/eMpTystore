import React from 'react'
import './header2.css'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios'



const header2 = ({ setmanagehomepagevisible, managehomepagevisible }) => {
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
      <div id='box2header2'>
        <img src="\E.png" alt="logo" />
        <div id='box23header2'>
          <button onClick={(e) => { navigate("/searchbox"); }}>
                <img src="\search_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png" alt="Search" />
            </button>
          <button onClick={(e) => { navigate("/Menu"); }}>
            <img src="\menu_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png" alt="More" />
          </button>
        </div>
      </div>
      {(userRole === 'Seller') && (
        <div id='box3header2'>
          <button
            style={{
              color: managehomepagevisible === 'Order' ? 'grey' : 'white'
            }}
            onClick={(e) => { setmanagehomepagevisible('Order') }}>Orders</button>
          <button
            style={{
              color: managehomepagevisible === 'Product' ? 'grey' : 'white'
            }}
             onClick={(e) => { setmanagehomepagevisible('Product') }}
            >Product</button>
          <button   style={{
              color: managehomepagevisible === 'UI' ? 'grey' : 'white'
            }}
             onClick={(e) => { setmanagehomepagevisible('UI') }}
            >UI</button>
        </div>
      )}
    </div>
  )
}

export default header2