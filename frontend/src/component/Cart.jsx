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
    const navigate = useNavigate()


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
        if (res2.data.CartItem.length === 0) {
            navigate(-1);
        }
        const totalAmount =
            res2.data.CartItem.reduce(
                (sum, item) =>
                    sum + item.quantity * Number(item.productprice),
                0
            ) + 30 + 2;
        settotalAmount(totalAmount)

    }


    useEffect(() => {

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
                            <h5>Service</h5>
                            <p>2</p>
                        </div>
                    </div>
                </div>
                <div id='Totalamountpay'>
                    <h3>Total Amount</h3>
                    <button><p>₹{totalAmount}</p><span>Pay</span></button>
                </div>


            </div>

        </div>
    )
}

export default Cart