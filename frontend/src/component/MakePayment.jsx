import React, { useEffect, useState } from 'react'
import "./MakePayment.css"
import Header2 from './header2'
import axios from "axios"

const MakePayment = () => {
    const token = localStorage.getItem("token");
    const [requests, setRequests] = useState([]);


    const fun1 = async (e) => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/withdrawalrequest`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setRequests(res.data.withdrawals);

        } catch (error) {
            console.log(error.message);

        }
    }
    useEffect(() => {
        fun1()
    })

    const handlePay = async (id) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/paytouser`,
                {
                    withdrawalId: id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(res.data);

        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    };

    const openUPI = (upiId, name, amount) => {

        const url =
            `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR`;

        window.location.href = url;
    }

    return (
        <div id='mainboxmakepayment'>
            <Header2 />
            <div id='box2makepayment'>
                {requests.length === 0 ? (
                    <h3>No withdrawal requests found.</h3>
                ) : (
                    requests.map((item) => (
                        <div id="withdrawlrequest" key={item._id}>
                            <p>
                                Name: {item.username}<br />
                                Amount: ₹{item.amount}<br />
                                UPI ID: {item.paymentDetails.upiId || "Not Provided"}<br />
                                Email: <span style={{ textTransform: "none" }}>{item.useremail}</span>
                            </p>

                            <div id="paybtnbox">
                                <button onClick={() =>
                                    openUPI(
                                        item.paymentDetails.upiId,
                                        item.username,
                                        item.amount
                                    )
                                }>Pay</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default MakePayment