import React from 'react'
import './header2.css'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios'



const Header2 = ({ setmanagehomepagevisible, managehomepagevisible }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [userRole, setuserRole] = useState('')
  const [shopOpenOrNot, setShopOpenOrNot] = useState(false);


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
        setShopOpenOrNot(res.data.shopOpenOrNot);
      } catch (err) {
        console.log(err);
      }
    };

    fun1();
  }, [token]);

  const handleShopOpenOrNotToggle = async () => {
    try {
      alert(`Your Shop is now ${shopOpenOrNot === 'Open' ? 'Closed' : 'Open'}`);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/toggleShopOpenOrNot`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShopOpenOrNot(res.data.shopOpenOrNot);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div id='mainboxheader2'>
      <div id='box2header2'>
        <img src="\E.png" alt="logo" />
        <div id='box23header2'>
          {userRole === 'Seller' && (
          <button onClick={handleShopOpenOrNotToggle} className='ShopOpenornotbox1'>
            <div style={{ backgroundColor: shopOpenOrNot === 'Open' ? 'lightgreen' : 'rgb(208, 114, 114)', display: 'flex', alignItems: 'center', justifyContent: shopOpenOrNot === 'Open' ? 'flex-start' : 'flex-end' }} id='ShopOpenornotbox2'>
              <div style={{ backgroundColor: shopOpenOrNot === 'Open' ? 'green' : 'red' }} id='ShopOpenornotcircle'></div><br />
            </div>
            <h5 style={{ color: shopOpenOrNot === 'Open' ? 'Green' : 'Red' }} id='ShopOpenornottext'>{shopOpenOrNot === 'Open' ? 'Open' : 'Closed'}</h5>

          </button>
           )} 
          <button onClick={() => { navigate("/searchbox"); }}>
            <img src="\search_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png" alt="Search" />
          </button>
          <button onClick={() => { navigate("/Menu"); }}>
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
            onClick={() => { setmanagehomepagevisible('Order') }}>Orders</button>
          <button
            style={{
              color: managehomepagevisible === 'Product' ? 'grey' : 'white'
            }}
            onClick={() => { setmanagehomepagevisible('Product') }}
          >Product</button>
          <button style={{
            color: managehomepagevisible === 'UI' ? 'grey' : 'white'
          }}
            onClick={() => { setmanagehomepagevisible('UI') }}
          >UI</button>
        </div>
      )}
    </div>
  )
}

export default Header2