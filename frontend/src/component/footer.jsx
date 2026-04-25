import React from 'react'
import './footer.css'
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios'

const footer = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [userRole, setuserRole] = useState('')



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
                setkey(res.data.pickup_location);
            } catch (err) {
                console.log(err);
            }
        };

        fun1();
    }, [token]);

    return (

        <div id='mainboxfooter'>
            {(userRole === 'Seller' || userRole === 'Admin') && (<button onClick={(e) => { navigate("/uploadproduct"); }}>
                <img src="\add_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png" alt="add product" />
            </button>)}
            <button onClick={(e) => { navigate("/searchbox"); }}>
                <img src="\search_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png" alt="Search" />
            </button>
        </div>

    )
}

export default footer
