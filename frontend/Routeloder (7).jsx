import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Header2 from './header2'
import './Menu.css'

const Menu = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const [userRole, setuserRole] = useState('')

    useEffect(() => {
        if (!token) {
            navigate('/Auth')
            return
        }

        const fun1 = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/checkuserinfo`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                setuserRole(res.data.role)
            } catch (err) {
                console.log(err)
            }
        }

        fun1()
    }, [token])

    const logout = () => {
        localStorage.removeItem('token')
        navigate('/Auth')
    }

    const isSeller = userRole === 'Seller' || userRole === 'Admin'
    const isAdmin = userRole === 'Admin'

    const items = [
        { to: '/Key', label: 'Your role', hint: 'See your role and ask to change it', show: true },
        { to: '/OrderStatus', label: 'Order status', hint: 'Follow orders for your shop', show: isSeller },
        { to: '/Request', label: 'Requests', hint: 'Role change requests to review', show: isAdmin },
        { to: '/Uploadcomponent', label: 'Upload component', hint: 'Add a new shop page layout', show: isAdmin },
        { to: '/MakePayment', label: 'Make payments', hint: 'Pay out withdrawal requests', show: isAdmin },
        { to: '/AboutUs', label: 'About Empty Store', hint: 'How the app works and what it costs', show: true }
    ].filter((item) => item.show)

    return (
        <div className="page">
            <Header2 />
            <main className="page-body is-narrow">
                <h1 className="page-title">Menu</h1>
                {userRole && <p className="page-lead">Signed in as {userRole.replace('_', ' ').toLowerCase()}.</p>}

                <ul className="menu-list">
                    {items.map((item) => (
                        <li key={item.to}>
                            <button type="button" className="menu-item" onClick={() => navigate(item.to)}>
                                <span className="menu-item-text">
                                    <span className="menu-item-label">{item.label}</span>
                                    <span className="menu-item-hint">{item.hint}</span>
                                </span>
                                <span className="menu-item-chevron" aria-hidden="true">&rsaquo;</span>
                            </button>
                        </li>
                    ))}
                </ul>

                <button type="button" className="btn btn-danger btn-block menu-logout" onClick={logout}>
                    Log out
                </button>
            </main>
        </div>
    )
}

export default Menu
