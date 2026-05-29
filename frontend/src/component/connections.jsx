import React, { useState, useEffect } from 'react'
import './connections.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Connections = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [shops, setShops] = useState([]);

  useEffect(() => {
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
        setShops(res.data.shops);

      } catch (err) {
        console.log(err);
      }
    };

    fun1();
  }, [token]);

  return (
    <div id='mainboxconnections'>

      {shops.length > 0 ? (shops.map((shop, index) => (
        <div id='Shopnoxs' 
        style={{
          opacity: shop.shopOpenOrNot === 'open' ? 'none' : 0.5,
  backgroundColor: shop.ui.generalinfo.BackgroundColor || "transparent",
  backgroundImage: shop.ui.generalinfo.Backgroundimage
    ? `url(${shop.ui.generalinfo.Backgroundimage})`
    : "none",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat"
}}
  key={index} onClick={() => {
          navigate("/Shopnox", {
            state: {
              id: shop._id
            }
          })
        }}>
          <h3 style={{color:shop.ui.generalinfo.TextColor}}>{shop.ui.generalinfo.BusinessName}</h3>
        </div>
      ))) : (
        <div id='addshop'>
          <div id='plus' onClick={() => navigate("/searchbox")}>+ </div>
          <div id='plustext'>Add Shop</div>
        </div>
      )}

    </div>
  )
}

export default Connections