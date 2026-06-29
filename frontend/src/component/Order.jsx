import React, { useEffect } from 'react'
import './Order.css'
import Header2 from "./header2";
import { useState } from 'react';
import axios from 'axios'
import QrScanner from "./QrScanner"
import { useNavigate } from "react-router-dom";


const Order = () => {
  const token = localStorage.getItem("token");
  const [orders, setrorders] = useState([])
  const [userRole, setuserRole] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();
  const [clat, setclat] = useState('')
  const [clong, setclong] = useState('')

  const fetchOrders = async () => {
    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const clatitude = position.coords.latitude;
          const clongitude = position.coords.longitude;
          setclat(clatitude)
          setclong(clongitude)
        },
        (error) => {
          console.log(error.message);
        }
      );

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
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {


    fetchOrders();
    fun1();
  }, [token]);

  const handleconfirm = async (e) => {
    const result = window.confirm("Do you want to continue?");
    if (result) {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/confirmOrders`,
        { orderid: e }, // empty body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
    fetchOrders();

  }
  // const printAllOrders = (orders) => {
  //   const win = window.open("", "", "width=800,height=600");

  //   let content = `
  //   <html>
  //     <head>
  //       <title>All Orders</title>
  //       <style>
  //         body {
  //           font-family: Arial;
  //           padding: 20px;
  //         }
  //         .box {
  //           border: 2px solid black;
  //           padding: 15px;
  //           margin-bottom: 15px;
  //           width: 350px;
  //         }
  //         h2 {
  //           text-align: center;
  //         }
  //         .row {
  //           margin: 6px 0;
  //         }
  //         .bold {
  //           font-weight: bold;
  //         }
  //       </style>
  //     </head>
  //     <body>
  //       <h2>All Orders</h2>
  // `;

  //   orders.forEach((order) => {
  //     content += `
  //     <div class="box">
  //       <div class="row"><span class="bold">customername:</span> ${order.customername}</div>
  //       <div class="row"><span class="bold">customeremail:</span> ${order.customeremail}</div>
  //       <div class="row"><span class="bold">address:</span> ${order.address}</div>
  //       <div class="row"><span class="bold">state:</span> ${order.state}</div>
  //       <div class="row"><span class="bold">district:</span> ${order.district}</div>
  //       <div class="row"><span class="bold">pincode:</span> ${order.pincode}</div>
  //       <div class="row"><span class="bold">Orderid:</span> ${order._id}</div>
  //       <div class="row"><span class="bold">productname:</span> ${order.productname}</div>
  //       <div class="row"><span class="bold">quantity:</span> ${order.quantity}</div>
  //       <div class="row"><span class="bold">sellerid:</span> ${order.sellerid}</div>
  //       <div class="row"><span class="bold">Date:</span> ${new Date().toLocaleDateString()}</div>
  //     </div>
  //   `;
  //   });

  //   content += `
  //     </body>
  //   </html>
  // `;

  //   win.document.write(content);
  //   win.document.close();
  //   win.print();
  // };

  const handlereadyforshipment = async (e) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/readyforDelivary`,
        { orderid: e, clat, clong },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchOrders();

    } catch (err) {
      console.log("REAL ERROR:", err.response?.data); // 👈 IMPORTANT
    }
    fetchOrders();

  };

  const handleScan = (order) => {
    setSelectedOrder(order);
    setShowScanner(true);
  };

  const handleOutfordelivary = async (e) => {

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/Outfordelivary`,
        { orderid: e },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.log("REAL ERROR:", err.response?.data); // 👈 IMPORTANT
    }
    fetchOrders();

  };

  return (
    <div id='mainboxOrder'>
      {userRole === "Seller" &&
        <div id='box2OrderConfirm'>

          <h3>Confirm Order</h3>
          {Array.isArray(orders) && orders.length > 0 ? (
            orders.map((order) => (
              <div key={order._id} style={order.orderstatus === 'Pending' ? {
                padding: "4px",
                boxShadow: '1px 1px 8px 3px #000',
                width: "80%",
                borderRadius: "20px",
                marginTop: "5px",
                height: "160px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textTransform: "capitalize",
                fontFamily: "sans-serif"
              } : { display: "none" }} className='box3Order' >
                {order.items.map((item, i) => (
                  <p key={i} style={{ marginBottom: "8px" }}>
                    {item.productname} {item.quantity}x <br />
                  </p>
                ))} <br />
                Order Value:- {
                  order.items.reduce((sum, item) => {
                    return sum + (item.quantity * item.price);
                  }, 0)
                }
                <br />
                phoneNo:-{order.phoneNo}
                {order.orderstatus === 'Pending' ?
                  <button style={{
                    backgroundColor: "#000",
                    color: "#fff",
                    width: "30%",
                    height: "30%",
                    borderRadius: "10px"
                  }} onClick={() => handleconfirm(order._id)}>Confirm</button> :
                  <></>}

              </div>
            ))
          ) : (
            <p>No orders found</p>
          )}        </div>
      }
      {userRole === "Seller" &&
        <div id='box2OrderPreparing'>

          <h3>Preparing Order</h3>
          {Array.isArray(orders) && orders.length > 0 ? (
            orders.map((order) => (
              <div key={order._id} style={order.orderstatus === 'Confirm' ? {
                padding: "4px",
                boxShadow: '1px 1px 8px 3px #000',

                width: "80%",
                borderRadius: "20px",
                marginTop: "5px",
                height: "160px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textTransform: "capitalize",
                fontFamily: "sans-serif"
              } : { display: "none" }} className='box3Order' >
                {order.items.map((item, i) => (
                  <p key={i} style={{ marginBottom: "8px" }}>
                    {item.productname} {item.quantity}x <br />
                  </p>

                ))} <br />
                Order Value:- {
                  order.items.reduce((sum, item) => {
                    return sum + (item.quantity * item.price);
                  }, 0)
                }
                <br />
                phoneNo:-{order.phoneNo}
                {order.orderstatus === 'Confirm' ?
                  <button style={{
                    backgroundColor: "#000",
                    color: "#fff",
                    width: "30%",
                    height: "30%",
                    borderRadius: "10px"
                  }} onClick={() => handlereadyforshipment(order._id)}>Ready for Delivary</button> :
                  <></>}
              </div>
            ))
          ) : (
            <p>No orders found</p>
          )}        </div>
      }
      {userRole === "Seller" &&
        <div id='box2OrderPreparing'>

          <h3>Out For Delivary</h3>
          {Array.isArray(orders) && orders.length > 0 ? (
            orders.map((order) => (
              <div key={order._id} style={order.orderstatus === 'RFD' ? {
                padding: "4px",
                boxShadow: '1px 1px 8px 3px #000',

                width: "80%",
                borderRadius: "20px",
                marginTop: "5px",
                height: "160px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textTransform: "capitalize",
                fontFamily: "sans-serif"
              } : { display: "none" }} className='box3Order' >
                OrderItems:-
                {order.items.map((item, i) => (
                  <p key={i} style={{ marginBottom: "8px" }}>
                    {item.productname} {item.quantity}x <br />
                  </p>

                ))}
                Order Value:- {
                  order.items.reduce((sum, item) => {
                    return sum + (item.quantity * item.price);
                  }, 0)
                }
                <br />
                phoneNo:-{order.phoneNo}
                {order.orderstatus === 'RFD' ?
                  <button style={{
                    backgroundColor: "#000",
                    color: "#fff",
                    width: "30%",
                    height: "30%",
                    borderRadius: "10px"
                  }} onClick={() => handleScan(order)}>Scan Qr</button> :
                  <></>}

                <div>
                </div>

              </div>
            ))
          ) : (
            <p>No orders found</p>
          )}        </div>
      }

      {showScanner && selectedOrder && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.7)",
            zIndex: 9999,
          }}
        >
          <QrScanner
            onScan={(result) => {
              const scannedValue =
                typeof result === "string"
                  ? result
                  : result?.text;   // 👈 IMPORTANT FIX

              console.log("SCANNED VALUE:", scannedValue);

              if (!scannedValue) {
                alert("No QR data detected");
                return;
              }

              const expected = String(selectedOrder._id);

              if (scannedValue.trim().includes(expected)) {
                alert("Correct Order Scanned ✔")

                handleOutfordelivary(selectedOrder._id);
                setShowScanner(false);

                navigate("/home");
              } else {
                alert("Wrong Order QR");

                setShowScanner(false);

                navigate("/home");
              }

              setShowScanner(false);
              setSelectedOrder(null);
            }}
          />
        </div>
      )}
    </div>
  )
}

export default Order
