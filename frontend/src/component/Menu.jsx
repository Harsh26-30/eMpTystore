import React from 'react'
import './Menu.css'
import { useNavigate } from 'react-router-dom';

const Menu = () => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div id='mainboxMenu'>
            <div id='box2Menu'>
                <h2>Menu</h2>
                <button id='logoutbutton' onClick={logout}>Logout</button>
            </div>
        </div>
    )
}

export default Menu