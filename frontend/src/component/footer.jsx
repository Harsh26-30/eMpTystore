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
            } catch (err) {
                console.log(err);
            }
        };

        fun1();
    }, [token]);

    return (
        <nav className="ft-bar" aria-label="Quick links">
            <button type="button" className="ft-btn" onClick={() => { navigate("/searchbox"); }}>
                <img className="ft-icon" src="/search_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png" alt="" />
                <span>Search shops</span>
            </button>
        </nav>
    )
}

export default footer
