import React, { useEffect, useState } from 'react'
import './wallet.css'
import Header2 from './header2'
import axios from "axios"

const Wallet = () => {
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

    const handleWithdraw = async () => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/withdrawWallet`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert(res.data.message);
            fun();

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div id='walletmainbox'>
            <Header2 />

            <div id='boxtotalbalance'>
                <div id='currentamount'>
                    <h2>₹{amount}</h2>
                </div>
                <h3>Total Amount</h3>
            </div>

            <div id='boxwithdrawbtn'>
                {amount > 50 && <button onClick={handleWithdraw}>
                    Withdraw
                </button>}
            </div>
        </div>
    );
};

export default Wallet;