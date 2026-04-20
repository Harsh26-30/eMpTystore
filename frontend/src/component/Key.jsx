import React, { useEffect, useState } from 'react'
import './Key.css'
import axios from 'axios';
import Header2 from './header2';


const Key = () => {
    const token = localStorage.getItem("token");
    const [key, setkey] = useState('')


    useEffect(() => {
        const fun1 = async (params) => {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/checkuserinfo`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setkey(res.data.pickup_location)

        }

        fun1();

    })

    const handlerequestkey = async (e) => {
        const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/createkey`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setkey(res.data.pickup_location)
    }


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
                    <button onClick={()=>{handlerequestkey}}>Request Key</button>
                </div>
            )}
            
        </div>
    )
}

export default Key