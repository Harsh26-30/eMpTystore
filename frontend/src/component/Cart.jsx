import React, { useState } from 'react'
import "./Cart.css"
import Header2 from "./header2"
import { useEffect } from 'react';
import axios from "axios"
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const [CartItem, setCartItem] = useState([]);
    const token = localStorage.getItem("token");
    const [totalAmount, settotalAmount] = useState()
    const [serviceandtax, setserviceandtax] = useState()
    const navigate = useNavigate()
    const [clat, setclat] = useState(null);
    const [clong, setclong] = useState(null);

const getServiceCharge = (productAmount) => {
  const deliveryCharge = 30;
  const minimumProfit = 2;

  let serviceCharge = minimumProfit;

  while (true) {
    const totalAmount = productAmount + deliveryCharge + serviceCharge;

    const razorpayCharge = totalAmount * 0.02 * 1.18;

    if (serviceCharge - razorpayCharge >= minimumProfit) {
      return Math.ceil(serviceCharge);
    }

    serviceCharge++;
  }
};

    const fun = async (e) => {
        const res2 = await axios.get(
            `${import.meta.env.VITE_API_URL}/checkuserinfo`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );


        setCartItem(res2.data.CartItem)
        const cartItems = res2.data.CartItem || [];

        if (cartItems.length === 0) {
            navigate(-1);
        }

        if (!cartItems) {
            console.error("THIS IS UNDEFINED!");
        }

        const subtotal =
            cartItems.reduce(
                (sum, item) => sum + item.quantity * Number(item.productprice),
                0
            );
        const deliveryCharge = 30;
        const serviceCharge = getServiceCharge(subtotal);

        const totalAmount = subtotal + deliveryCharge + serviceCharge;

        settotalAmount(totalAmount);
        setserviceandtax(serviceCharge)

    }


    useEffect(() => {

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

        fun();
    }, [])

    const handlenegativeclick = async (item) => {

        const newQuantity = item.quantity - 1;

        await axios.post(
            `${import.meta.env.VITE_API_URL}/updateCartItemQuanity`,
            {
                quantity: newQuantity,
                productid: item.productid
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        fun();
    };

    const handlepositiveclick = async (item) => {

        const newQuantity = item.quantity + 1;

        await axios.post(
            `${import.meta.env.VITE_API_URL}/updateCartItemQuanity`,
            {
                quantity: newQuantity,
                productid: item.productid
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        fun();
    };

    const handleclickorder = async () => {
        try {
            const orderItems = CartItem.map(item => ({
                productid: item.productid,
                productname: item.productname,
                quantity: item.quantity,
                sellerid: item.Seller_id,   // ✅ correct property
                price: item.productprice
            }));

            // STEP 1: create Razorpay order
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/create-order`,
                {
                    items: orderItems
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const razorpayOrder = res.data.razorpayOrder;

            // STEP 2: open Razorpay popup
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                order_id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: "Empty Store",

                handler: async function (response) {
                    try {
                        // STEP 3: verify payment
                        await axios.post(
                            `${import.meta.env.VITE_API_URL}/verify-payment`,
                            {
                                ...response,
                                items: orderItems,
                                customerlatitude: clat,
                                customerlongitude: clong
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        alert("Payment Successful & Order Placed");
                        navigate("/home"); // optional

                    } catch (err) {
                        console.log(err);
                        alert("Payment verification failed");
                    }
                },

                theme: {
                    color: "#3399cc"
                }
            };

            if (!window.Razorpay) {
                alert("Razorpay SDK not loaded");
                return;
            }

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.log(err);
            alert("Order failed");
        }
    };
    return (
        <div id='mainboxcart'>
            <Header2 />
            {CartItem?.map((item) => (
                <div id='Items'>
                    <img src={item.productimg} alt="PI" />
                    <div id='itemdetail'>
                        <p>{item.productname}<br />
                            <span>{item.Seller_Name}</span> <br />
                            <span>{item.productprice}</span></p>
                    </div>
                    <div id='itemquanity'>
                        <button onClick={() => handlenegativeclick(item)}>-</button>
                        <input type="number" value={item.quantity} readOnly />
                        <button onClick={() => handlepositiveclick(item)}>+</button>                    </div>
                </div>
            ))}

            <div id='TotalAmountToPayBox'>
                <div id='Allcharges'>
                    <h4>Internal Charges</h4>
                    {CartItem?.map((item) => (
                        <div id='internalcharges'>
                            <h5>{item.productname}<span>{item.quantity}x</span></h5>
                            <p>{item.quantity * item.productprice}</p>
                        </div>
                    ))}
                    <h4>External Charges</h4>
                    <div id='externalcharges'>
                        <div className='externalcharge'>
                            <h5>Delivery</h5>
                            <p>30</p>
                        </div>
                        <div className='externalcharge'>
                            <h5>Service & tax</h5>
                            <p>{serviceandtax}</p>
                        </div>
                    </div>
                </div>
                <div id='Totalamountpay'>
                    <div>
                        <h3>Total Amount</h3>
                    </div>
                    <button onClick={handleclickorder}><p>₹{totalAmount}</p><span>Order Now</span></button>
                </div>


            </div>

        </div>
    )
}

export default Cart