import React, { useState } from 'react'
import { useEffect } from 'react';
import axios from 'axios';
import './myOrderStatus.css'
import Header2 from './header2'

const MyOrderStatus = () => {
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);
  useEffect(() => {
    if (!token) return; 
    const fetchOrderStatus = async () => {
      try {
         const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/myOrderStatus`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        setOrders(res.data);

      } catch (error) {
        console.error("Error fetching order status:", error);
      }
    };

    fetchOrderStatus();
  }, [token]);

  return (
    <div id='mainboxmyorderstatus'>
      <Header2 />
      {orders.map((order) => (
      <div  key={order._id} id='boxmyorderstatus'>
        <div id='box1myorderstatus'>
          <img src={order.productImage} alt="Product Image" />
        </div>
        <div id='orderdetailmyorderstatus'>
          <h3>Odered Item: {order.orderName || "Not mentioned"}</h3>
          <h3>Seller Name: {order.sellerOrShopName || "Not mentioned"}</h3>
          <h3>Customer Name: {order.customerName || "Not mentioned"}</h3>
          <h3>Customer Contact: {order.customerContact || "Not mentioned"}</h3>
        </div>
        <h3>Order Status</h3>
        <div style={{ backgroundColor: order.orderStatus === 'pending' ?
           'grey' : order.orderStatus === 'Confirm' ?
            'green' : order.orderStatus === 'preparing' ?
             'blue' : order.orderStatus === 'OFD' ? 'Yellow' : '' }} 
             id='orderstatusmyorderstatus'>
          <h4 style={{color: order.orderStatus === 'pending' ?
           'grey' : order.orderStatus === 'Confirm' ?
            'darkgreen' : order.orderStatus === 'preparing' ?
             'darkblue' : order.orderStatus === 'OFD' ? 'orange' : '' }} >{order.orderStatus === 'Pending' ? "Pending" : order.orderStatus === 'Confirm' ? "Preparing" : order.orderStatus === 'RFD' ? "Ready For Delivery" : order.orderStatus === 'OFD' ? "Out for Delivery" : "Analysing..."}</h4>
        </div>
      </div>
      ))}
    </div>
  )
}

export default MyOrderStatus