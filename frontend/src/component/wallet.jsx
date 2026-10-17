import React, { useEffect, useState } from 'react'
import './wallet.css'
import Header2 from './header2'
import axios from "axios"
import { useLocation } from 'react-router-dom'
import Wallettotalamount from './wallettotalamount'
import Walletwithdrawbtn from './walletwithdrawbtn'

const Wallet = () => {
    const token = localStorage.getItem("token");
    const [amount, setAmount] = useState(0);
    const location = useLocation()

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
            {location.pathname === "/Wallet" && <Header2 />}

            {/* <div id='boxtotalbalance'>
                <div id='currentamount'>
                    <h2>₹{amount}</h2>
                </div>
                <h3>Total Amount</h3>
            </div> */}
            <Wallettotalamount/>
            <Walletwithdrawbtn/>
{/* 
            <div id='boxwithdrawbtn'>
                {amount > -1 && <button onClick={handleWithdraw}>
                    Withdraw
                </button>}
            </div> */}
        </div>
    );
};

export default Wallet;