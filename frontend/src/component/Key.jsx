import React, { useEffect, useState } from 'react'
import './Key.css'
import axios from 'axios';
import Header2 from './header2';


const Key = () => {
    const token = localStorage.getItem("token");
    const [key, setkey] = useState('')


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

                setkey(res.data.pickup_location);
            } catch (err) {
                console.log(err);
            }
        };

        fun1();
    }, [token]);

    const handlerequestkey = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/createkey`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(res.data);
            setkey(res.data.pickup_location);

        } catch (err) {
            console.log("ERROR:", err.response?.data || err.message);
            alert(err.response?.data?.msg || "Failed to create key");
        }
    };


    return (
        <div id='mainboxkey'>
            <Header2 />
            {key ? (
                <div>
                    <p>Your Seller Key Is <span>{key}</span></p>
                </div>
            ) : (
                <div id='boxrequestkey'>
                    <h3>Request For Seller Key</h3>
                    <button onClick={() => handlerequestkey()}>Request Key</button>                </div>
            )}

        </div>
    )
}

export default Key