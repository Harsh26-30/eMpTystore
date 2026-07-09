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
            <h2>Menu</h2>
            <div id='box2Menu'>

                <button id='menubutton' onClick={() => navigate("/Key")}>
                    Role
                </button>

                {(userRole === 'Seller' || userRole === 'Admin') && (
                    <button id='menubutton' onClick={() => navigate("/OrderStatus")}>
                        Order Status
                    </button>
                )}

                {(userRole === 'Admin') && (<button id='menubutton' onClick={() => navigate("/Order")}>
                    Orders
                </button>)}

                {(userRole === 'Admin') && (<button id='menubutton' onClick={() => navigate("/Request")}>
                    Requests
                </button>)}

                {(userRole === 'Admin') && (<button id='menubutton' onClick={() => navigate("/Uploadcomponent")}>
                    Upload_Component
                </button>)}
                {(userRole === 'Admin') && (<button id='menubutton' onClick={() => navigate("/MakePayment")}>
                    MakePayment
                </button>)}

                {(userRole === 'Seller' || userRole === 'Admin') && (
                    <button id='menubutton' onClick={() => navigate("/UserProfile")}>
                        Profile
                    </button>
                )}

                <button id='logoutbutton' onClick={logout}>
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Menu;