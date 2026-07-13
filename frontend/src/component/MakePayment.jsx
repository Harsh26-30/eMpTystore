import React, { useEffect, useState } from 'react'
import "./MakePayment.css"
import Header2 from './header2'
import axios from "axios"

const MakePayment = () => {
    const token = localStorage.getItem("token");
    const [requests, setRequests] = useState([]);
    const [wallets, setWallets] = useState({});


    const fun1 = async () => {
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

            res.data.withdrawals.forEach(item => {
                getUserWallet(item.userId);
            });

        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        fun1();
    }, []);

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


        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    };

    const openUPI = (upiId, name, amount) => {

        const url =
            `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR`;

        window.location.href = url;
    }

    const handlepaid = async (userId, amount, requestId) => {
        const confirmPayment = window.confirm(
            `Are you sure you want to deduct ₹${amount} from the wallet?`
        );


        if (!confirmPayment) {
            return;
        }

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/updateuserwallet`,
                {
                    userId,
                    amount: Number(amount),
                    requestId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Payment confirmed and wallet updated", res.data.message);
            fun1()

        } catch (error) {
            console.log(error.response?.data || error.message);
            alert("Wallet update failed");
        }
    };

    const getUserWallet = async (userId) => {
        try {

            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/userWallet/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setWallets(prev => ({
                ...prev,
                [userId]: res.data.wallet
            }));

        } catch (error) {
            console.log(error.message);
        }
    };

    const handlereject = async (requestId) => {
        const confirmPayment = window.confirm(
            `Are you sure you want to Reject ?`
        );


        if (!confirmPayment) {
            return;
        }

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/rejectpayment`,
                {

                    requestId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            fun1()


        } catch (error) {
            console.log(error.response?.data || error.message);
            alert("Wallet update failed");
        }

    }

    return (
        <div id='mainboxmakepayment'>
            <Header2 />
            <div id='box2makepayment'>
                {requests.filter(item => item.status === "Pending").length === 0 ? (
                    <h3>No pending withdrawal requests found.</h3>
                ) : (
                    requests
                        .filter(item => item.status === "Pending")
                        .map((item) => (
                            <div id="withdrawlrequest" key={item._id}>
                                <p>
                                    Name: {item.username}<br />
                                    Amount: ₹{item.amount}<br />
                                    Current Wallet: ₹{wallets[item.userId] ?? "Loading..."}<br />
                                    UPI ID: {item.paymentDetails.upiId || "Not Provided"}<br />
                                    Email: <span style={{ textTransform: "none" }}>{item.useremail}</span>
                                </p>

                                <div id="paybtnbox">
                                    <button onClick={() =>
                                        handlereject(

                                            item._id
                                        )
                                    }>
                                        Reject
                                    </button>

                                    <button onClick={() =>
                                        openUPI(
                                            item.paymentDetails.upiId,
                                            item.username,
                                            item.amount
                                        )
                                    }>
                                        Pay
                                    </button>

                                    <button onClick={() =>
                                        handlepaid(
                                            item.userId,
                                            item.amount,
                                            item._id
                                        )
                                    }>
                                        Paid
                                    </button>


                                </div>
                            </div>
                        ))
                )}
            </div>
        </div>
    )
}

export default MakePayment