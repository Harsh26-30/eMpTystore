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
    const [loading, setLoading] = useState(true);
    const [placing, setPlacing] = useState(false);
    const [error, setError] = useState('');
    const [done, setDone] = useState(false);

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
        try {
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
        } catch (err) {
            console.log(err);
            setError('We could not load your cart. Check your connection and try again.');
        } finally {
            setLoading(false);
        }
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
        setError('');
        setPlacing(true);
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

                        setDone(true);

                    } catch (err) {
                        console.log(err);
                        setError('Your payment went through but we could not confirm the order. Do not pay again. Check My orders, or contact support.');
                    } finally {
                        setPlacing(false);
                    }
                },

                modal: {
                    ondismiss: function () {
                        setPlacing(false);
                    }
                },

                theme: {
                    color: "#1A62E6"
                }
            };

            if (!window.Razorpay) {
                setError('The payment window could not load. Check your connection and refresh the page.');
                setPlacing(false);
                return;
            }

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.log(err);
            setError('We could not start your payment. Please try again.');
            setPlacing(false);
        }
    };
    const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
    const subtotal = (CartItem || []).reduce((sum, item) => sum + item.quantity * Number(item.productprice), 0);

    if (done) {
        return (
            <div className="page">
                <Header2 />
                <main className="page-body is-narrow">
                    <div className="card cart-done">
                        <h1 className="page-title">Order placed</h1>
                        <p className="page-lead">Your payment went through. The shop will confirm your order shortly, and you can follow it in My orders.</p>
                        <div className="cart-done-actions">
                            <button type="button" className="btn btn-primary btn-block" onClick={() => navigate('/myOrderStatus')}>Follow my order</button>
                            <button type="button" className="btn btn-secondary btn-block" onClick={() => navigate('/home')}>Back to shops</button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="page">
            <Header2 />
            <main className="page-body is-narrow">
                <h1 className="page-title">Your cart</h1>

                {loading && (
                    <div className="stack cart-gap" aria-busy="true" aria-label="Loading your cart">
                        <div className="skeleton" />
                        <div className="skeleton" />
                    </div>
                )}

                {!loading && (CartItem || []).length === 0 && (
                    <div className="empty-state cart-gap">
                        <p>Your cart is empty. Pick a shop and add something you need.</p>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/home')}>Browse shops</button>
                    </div>
                )}

                {!loading && (CartItem || []).length > 0 && (
                    <>
                        <ul className="cart-list">
                            {CartItem.map((item) => (
                                <li key={item.productid} className="card cart-item">
                                    {item.productimg
                                        ? <img className="cart-thumb" src={item.productimg} alt="" />
                                        : <span className="cart-thumb cart-thumb-empty" aria-hidden="true" />}
                                    <div className="cart-info">
                                        <p className="cart-name">{item.productname}</p>
                                        {item.Seller_Name && <p className="cart-seller">{item.Seller_Name}</p>}
                                        <p className="cart-price money">{money(item.productprice)}</p>
                                    </div>
                                    <div className="cart-stepper" role="group" aria-label={`Quantity of ${item.productname}`}>
                                        <button type="button" onClick={() => handlenegativeclick(item)} aria-label="Remove one">&minus;</button>
                                        <span className="cart-qty" aria-live="polite">{item.quantity}</span>
                                        <button type="button" onClick={() => handlepositiveclick(item)} aria-label="Add one">+</button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <section className="card cart-bill" aria-labelledby="cart-bill-title">
                            <h2 id="cart-bill-title" className="section-title">Bill</h2>
                            <dl className="cart-lines">
                                {CartItem.map((item) => (
                                    <div key={item.productid} className="cart-line">
                                        <dt>{item.productname} <span className="cart-times">x {item.quantity}</span></dt>
                                        <dd className="money">{money(item.quantity * item.productprice)}</dd>
                                    </div>
                                ))}
                                <div className="cart-line is-sub">
                                    <dt>Items total</dt>
                                    <dd className="money">{money(subtotal)}</dd>
                                </div>
                                <div className="cart-line">
                                    <dt>Delivery</dt>
                                    <dd className="money">{money(30)}</dd>
                                </div>
                                <div className="cart-line">
                                    <dt>Service and payment fee</dt>
                                    <dd className="money">{money(serviceandtax)}</dd>
                                </div>
                                <div className="cart-line is-total">
                                    <dt>Total to pay</dt>
                                    <dd className="money">{money(totalAmount)}</dd>
                                </div>
                            </dl>
                        </section>

                        {error && <p className="alert alert-error cart-gap" role="alert">{error}</p>}

                        <button type="button" className="btn btn-primary btn-block cart-pay" onClick={handleclickorder} disabled={placing}>
                            {placing ? 'Opening payment…' : `Pay ${money(totalAmount)}`}
                        </button>
                    </>
                )}

                {!loading && (CartItem || []).length === 0 && error && <p className="alert alert-error cart-gap" role="alert">{error}</p>}
            </main>
        </div>
    )
}

export default Cart