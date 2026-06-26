import React, { useState } from 'react'
import { useEffect } from 'react';
import axios from 'axios';
import './myOrderStatus.css'
import Header2 from './header2'
import OrderQr from "./OrderQr"

const MyOrderStatus = () => {
  const token = localStorage.getItem("token");
  const [QrVusibility, setQrVusibility] = useState(false);
  const [SelectedOrder, setSelectedOrder] = useState(false);


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
        <div key={order._id} id='boxmyorderstatus'>
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
          <div style={{
            backgroundColor: order.orderStatus === 'pending' ?
              'grey' : order.orderStatus === 'Confirm' ?
                'green' : order.orderStatus === 'preparing' ?
                  'blue' : order.orderStatus === 'OFD' ? 'Yellow'
                    : order.orderStatus === 'Reached' ? 'green' :''
          }}
            id='orderstatusmyorderstatus'>
            <h4 style={{
              color: order.orderStatus === 'pending' ?
                'grey' : order.orderStatus === 'Confirm' ?
                  'darkgreen' : order.orderStatus === 'preparing' ?
                    'darkblue' : order.orderStatus === 'OFD' ? 'orange' : ''
            }} >{order.orderStatus === 'Pending' ? "Pending" :
             order.orderStatus === 'Confirm' ? "Preparing" :
              order.orderStatus === 'RFD' ? "Ready For Delivery" :
               order.orderStatus === 'OFD' ? "Out for Delivery" : 
               order.orderStatus === 'Reached' ? "Reached" :
                "Analysing..."}</h4>
          </div>

          <button id='qrbutton' style={{ width: "50%" }} onClick={() => { setQrVusibility(true), setSelectedOrder(order) }}>
            QR
          </button>

        </div>
      ))}
      {QrVusibility === true && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,   // 👈 highest layer
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {SelectedOrder && <OrderQr value={SelectedOrder._id} />}
            <button
              onClick={() => setQrVusibility(false)}
              style={{ marginTop: "10px" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyOrderStatus