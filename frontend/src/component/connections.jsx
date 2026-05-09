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

      {shops.map((shop, index) => (
        <div id='Shopnoxs' style={{ backgroundColor: shop.ui.generalinfo.Color }} key={index} onClick={(e) => {
          navigate("/Shopnox", {
            state: {
              id: shop._id
            }
          })
        }}>
          <h3>{shop.ui.generalinfo.BusinessName}</h3>
          <p>{shop.email}</p>
        </div>
      ))}

    </div>
  )
}

export default Connections