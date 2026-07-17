import React,{useState,useEffect} from 'react'
import "./walletwithdrawbtn.css"
import axios from 'axios';

const walletwithdrawbtn = () => {
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
        <div id='walletwithdrawbtnmainbox'>

            <div id='boxwithdrawbtn'>
                {amount > 49 ? <button onClick={handleWithdraw}>
                    Withdraw
                </button> : <p id='walletwithdrawbtnparagraph'> Minimum ₹50 can be withdraw</p>}
            </div>
        </div>
    )
}

export default walletwithdrawbtn