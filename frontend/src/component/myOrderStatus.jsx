import React, { useState } from 'react'
import { useEffect } from 'react';
import axios from 'axios';
import './myOrderStatus.css'
import Header2 from './header2'

const MyOrderStatus = () => {
  const token = localStorage.getItem("token");
  const [Orders, setOrders] = useState([]);
  
  useEffect(() => {
    if (!token) return; 
    const fetchOrderStatus = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/myOrderStatus`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrders(res.data.orders);

      } catch (error) {
        console.error("Error fetching order status:", error);
      }
    };

    fetchOrderStatus();
  }, [token]);

  return (
    <div id='mainboxmyorderstatus'>
      <Header2 />
      <div id='boxmyorderstatus'>
        <div id='box1myorderstatus'>
          <img src="\E.png" alt="Search" />
        </div>
        <div id='orderdetailmyorderstatus'>
          <h3>Odered Item: {Orders.orderName || "Not mentioned"}</h3>
          <h3>Seller Name: {Orders.sellerOrShopName || "Not mentioned"}</h3>
          <h3>Customer Name: {Orders.customerName || "Not mentioned"}</h3>
          <h3>Customer Contact: {Orders.customerContact || "Not mentioned"}</h3>
        </div>
        <h3>Order Status</h3>
        <div style={{ backgroundColor: Orders.orderStatus === 'pending' ? 'grey' : Orders.orderStatus === 'Confirm' ? 'Green' : Orders.orderStatus === 'preparing' ? 'Blue' : Orders.orderStatus === 'OFD' ? 'Yellow' : '' }} id='orderstatusmyorderstatus'>
          <h4>{Orders.orderStatus || "Analysing..."}</h4>
        </div>
      </div>
    </div>
  )
}

export default MyOrderStatus