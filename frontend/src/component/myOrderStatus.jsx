import React, { useState } from 'react'
import { useEffect } from 'react';
import axios from 'axios';
import './myOrderStatus.css'
import Header2 from './header2'

const myOrderStatus = () => {
  const token = localStorage.getItem("token");
  const [orderStatus, setOrderStatus] = useState('');
  const [orderName, setOrderName] = useState('');
  const [sellerOrShopName, setSellerOrShopName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  useEffect(() => {
    if (!token) return; 
    const fetchOrderStatus = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/myOrderStatus`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrderStatus(res.data.orderStatus);
        setOrderName(res.data.orderName);
        setSellerOrShopName(res.data.sellerOrShopName);
        setCustomerName(res.data.customerName);
        setCustomerContact(res.data.customerContact);

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
          <h3>Odered Item: {orderName || "Not mentioned"}</h3>
          <h3>Seller Name: {sellerOrShopName || "Not mentioned"}</h3>
          <h3>Customer Name: {customerName || "Not mentioned"}</h3>
          <h3>Customer Contact: {customerContact || "Not mentioned"}</h3>
        </div>
        <h3>Order Status</h3>
        <div style={{ backgroundColor: orderStatus === 'pending' ? 'grey' : orderStatus === 'Confirm' ? 'Green' : orderStatus === 'preparing' ? 'Blue' : orderStatus === 'OFD' ? 'Yellow' : '' }} id='orderstatusmyorderstatus'>
          <h4>{orderStatus || "Analysing..."}</h4>
        </div>
      </div>
    </div>
  )
}

export default myOrderStatus