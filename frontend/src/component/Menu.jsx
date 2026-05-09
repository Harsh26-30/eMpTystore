import React from 'react'
import './Menu.css'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

const Menu = () => {
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

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div id='mainboxMenu'>
            <div id='box2Menu'>
                <h2>Menu</h2>

                <button id='logoutbutton2' onClick={() => navigate("/Key")}>
                    Key
                </button>

                {(userRole === 'Seller' || userRole === 'Admin' ) && (
                    <button id='logoutbutton2' onClick={() => navigate("/OrderStatus")}>
                        Order Status
                    </button>
                )}

                {( userRole === 'Admin' ) && (<button id='logoutbutton2' onClick={() => navigate("/Order")}>
                    Orders
                </button>)}

                {( userRole === 'Admin' ) && (<button id='logoutbutton2' onClick={() => navigate("/Request")}>
                    Requests
                </button>)}

                {( userRole === 'Admin' ) && (<button id='logoutbutton2' onClick={() => navigate("/Uploadcomponent")}>
                    Upload Component
                </button>)}

                <button id='logoutbutton' onClick={logout}>
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Menu;