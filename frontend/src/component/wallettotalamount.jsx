import React, { useState, useEffect } from 'react'
import axios from 'axios';
import "./wallettotalamount.css"

const wallettotalamount = () => {
    const token = localStorage.getItem("token");
    const [amount, setAmount] = useState(0);

    const fun = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/walletTotalAmount`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setAmount(res.data.Wallet);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fun();
    }, []);

    return (
        <div id='wallettotalamountmainbox'>
            <div id='boxtotalbalance'>
                <div id='currentamount'>
                    <h2>₹{amount}</h2>
                </div>
                <h3>Total Amount</h3>
            </div>
        </div>
    )
}

export default wallettotalamount