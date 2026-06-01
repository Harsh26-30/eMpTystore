import React, { useEffect, useState } from 'react'
import './Key.css'
import axios from 'axios';
import Header2 from './header2';


const Key = () => {
    const token = localStorage.getItem("token");
    const [key, setkey] = useState('')
    const [msg, setmsg] = useState('')
    const [userRole,setuserRole] = useState('')



    useEffect(() => {
        if (!token) return;

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
                setkey(res.data.seller_key);
            } catch (err) {
                console.log(err);
            }
        };

        fun1();
    }, [token]);

    const handlerequestkey = async () => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/becomeseller`,{},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Your Request has been recorded within 24 hour your \n account will be updated");
            setmsg(res.data.msg);

        } catch (err) {
            console.log("ERROR:", err.response?.data || err.message);        }
    };


    return (
        <div id='mainboxkey'>
            <Header2 />
            {userRole === 'Seller' ? (
                <div id='keybox'>
                    <p>Your Seller Key Is <span>{key}</span></p>
                </div>
            ) : (
                <div id='boxrequestkey'>
                    <h3>Request to be Seller</h3>
                    <button onClick={() => handlerequestkey()}>Request</button>
                </div>
            )}

        </div>
    )
}

export default Key