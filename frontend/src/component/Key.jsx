import React, { useEffect, useState } from 'react'
import './Key.css'
import axios from 'axios';
import Header2 from './header2';


const Key = () => {
    const token = localStorage.getItem("token");
    const [msg, setmsg] = useState('')
    const [userRole, setuserRole] = useState('')
    const [msgVisible, setmsgVisible] = useState(false)

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

            const res2 = await axios.get(
                `${import.meta.env.VITE_API_URL}/checkrequeststatus`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setmsg(res2.data.msg);
            setmsgVisible(res2.data.success);

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (!token) return;

        fun1();
    }, [token]);

    const handlerequestkey = async (upgradeTo) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/requestupdateuserrole`, {
                upgradeTo: upgradeTo
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Your Request has been recorded within 24 hour your \n account will be updated");
            setmsg(res.data.msg);
            fun1();

        } catch (err) {
            console.log("ERROR:", err.response?.data || err.message);
        }
    };


    return (
        <div id='mainboxkey'>
            <Header2 />
            {msgVisible === false && (
                <div id='msgbox'>
                    <p>{msg}</p>
                </div>
            )}

            <div id = 'userCurrentRole'>
                <h3>Your Current Role: {userRole}</h3>
            </div>

            {userRole === 'Customer' && (
                <div id='boxrequestkey'>
                    <h3>Request to be Seller</h3>
                    <button onClick={() => handlerequestkey("Seller")}>
                        Request
                    </button>
                </div>
            )}

            {userRole === 'Customer' && (

                <div id='boxrequestkey'>
                    <h3>Request to be Delivery Partner</h3>
                    <button onClick={() => handlerequestkey("Delivery_partner")}>
                        Request
                    </button>
                </div>
            )}


        </div>
    )
}

export default Key