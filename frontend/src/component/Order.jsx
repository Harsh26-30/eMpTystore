import React, { useEffect } from 'react'
import './Order.css'
import Header2 from "./header2";
import { useState } from 'react';
import axios from 'axios'

const Order = () => {
  const token = localStorage.getItem("token");
  const [orders, setrorders] = useState([])
  const [visible, setvisible] = useState('Pending')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/Orders`,
          {}, // empty body
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(res.data.orders);
        setrorders(res.data.orders)
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, [token]);

  const handleconfirm = async (e) => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/confirmOrders`,
      { orderid: e }, // empty body
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  const printAllOrders = (orders) => {
    const win = window.open("", "", "width=800,height=600");

    let content = `
    <html>
      <head>
        <title>All Orders</title>
        <style>
          body {
            font-family: Arial;
            padding: 20px;
          }
          .box {
            border: 2px solid black;
            padding: 15px;
            margin-bottom: 15px;
            width: 350px;
          }
          h2 {
            text-align: center;
          }
          .row {
            margin: 6px 0;
          }
          .bold {
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <h2>All Orders</h2>
  `;

    orders.forEach((order) => {
      content += `
      <div class="box">
        <div class="row"><span class="bold">customername:</span> ${order.customername}</div>
        <div class="row"><span class="bold">customeremail:</span> ${order.customeremail}</div>
        <div class="row"><span class="bold">address:</span> ${order.address}</div>
        <div class="row"><span class="bold">state:</span> ${order.state}</div>
        <div class="row"><span class="bold">district:</span> ${order.district}</div>
        <div class="row"><span class="bold">pincode:</span> ${order.pincode}</div>
        <div class="row"><span class="bold">Orderid:</span> ${order._id}</div>
        <div class="row"><span class="bold">productname:</span> ${order.productname}</div>
        <div class="row"><span class="bold">quantity:</span> ${order.quantity}</div>
        <div class="row"><span class="bold">sellerid:</span> ${order.sellerid}</div>
        <div class="row"><span class="bold">Date:</span> ${new Date().toLocaleDateString()}</div>
      </div>
    `;
    });

    content += `
      </body>
    </html>
  `;

    win.document.write(content);
    win.document.close();
    win.print();
  };

const handlereadyforshipment = async (e) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/readyforshipment`,
      { orderid: e },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("SUCCESS:", res.data);

  } catch (err) {
    console.log("REAL ERROR:", err.response?.data); // 👈 IMPORTANT
  }
};

  return (
    <div id='mainboxOrder'>
      <div id='box1Order'>
        <h2>Manage Order</h2>
        <div id='box22Order'>
          <button onClick={() => setvisible('Pending')}>
            Confirm Order
          </button>
          <button onClick={() => setvisible('Confirm')}>
            Prepairing Order
          </button>
          
        </div>
      </div>

      <div id='box2Order'>

{  visible === 'Confirm'  &&  <button id='pd' onClick={() => printAllOrders(
  orders.filter(o => o.orderstatus === 'Confirm')
)}>Print Deatails</button>}      
  {Array.isArray(orders) && orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} style={order.orderstatus === visible ? {
              width: "390px", height: "140px", padding: "7px", boxShadow: '1px 1px 8px 3px #000'
            } : {}} className='box3Order' >
              {order.orderstatus === visible ? <p>
                productid:-{order.productid}<br />
                productname:-{order.productname}<br />
                customeremail:-{order.customeremail} <br />
                customerid:-{order.customerid}<br />
                phoneNo:-{order.phoneNo}<br />
                quantity:-{order.quantity}
              </p> : <></>}
              {order.orderstatus === 'Pending' ?
                <button onClick={() => handleconfirm(order._id)}>Confirm</button> :
                <></>}
              <div>
                {order.orderstatus === 'Confirm' && order.orderstatus === visible ?
                  <button onClick={() => handlereadyforshipment(order._id)}>Ready for Shipment</button> :
                  <></>}
              </div>
            </div>
          ))
        ) : (
          <p>No orders found</p>
        )}        </div>
    </div>
  )
}

export default Order
