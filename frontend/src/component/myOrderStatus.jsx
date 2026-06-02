import React, { useState } from 'react'
import { useEffect } from 'react';
import axios from 'axios';
import './myOrderStatus.css'
import Header2 from './header2'

const MyOrderStatus = () => {
  const token = localStorage.getItem("token");
  const [Orders, setOrders] = useState([]);
  const [userId, setUserId] = useState('');
  
  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/myOrderStatus`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrders(res.data.orders);

        const res2 = await axios.get(`${import.meta.env.VITE_API_URL}/checkuserinfo`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserId(res2.data.id);

      } catch (error) {
        console.error("Error fetching order status:", error);
      }
    };

    fetchOrderStatus();
  }, [token]);

  return (
    <div id='mainboxmyorderstatus'>
      <Header2 />
      {Orders.map((order) => (
      <div  key={order._id} style={{display:order.customerid === userId ? 'block' : 'none'}} id='boxmyorderstatus'>
        <div id='box1myorderstatus'>
          <img src="\E.png" alt="Search" />
        </div>
        <div id='orderdetailmyorderstatus'>
          <h3>Odered Item: {order.orderName || "Not mentioned"}</h3>
          <h3>Seller Name: {order.sellerOrShopName || "Not mentioned"}</h3>
          <h3>Customer Name: {order.phoneNo || "Not mentioned"}</h3>
          <h3>Customer Contact: {order.customerContact || "Not mentioned"}</h3>
        </div>
        <h3>Order Status</h3>
        <div style={{ backgroundColor: order.orderStatus === 'pending' ? 'grey' : order.orderStatus === 'Confirm' ? 'Green' : order.orderStatus === 'preparing' ? 'Blue' : order.orderStatus === 'OFD' ? 'Yellow' : '' }} id='orderstatusmyorderstatus'>
          <h4>{order.orderStatus || "Analysing..."}</h4>
        </div>
      </div>
      ))}
    </div>
  )
}

export default MyOrderStatus