import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './Key.css'
import axios from 'axios';
import Header2 from './header2';

const ROLE_NAMES = {
    Customer: 'Customer',
    Seller: 'Seller',
    Delivery_partner: 'Delivery partner',
};

const OPTIONS = [
    {
        requestof: 'Seller',
        title: 'Become a seller',
        text: 'List your products and take orders from customers near your shop.',
    },
    {
        requestof: 'Delivery_partner',
        title: 'Become a delivery partner',
        text: 'Pick up orders from local shops and deliver them to customers.',
    },
]

const Key = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate()
    const [msg, setmsg] = useState('')
    const [userRole, setuserRole] = useState('')
    const [msgVisible, setmsgVisible] = useState(false)
    const [status,setstatus] = useState()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const fun1 = async () => {
        setError('')
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
            setstatus(res2.data.requestStatus)

        } catch (err) {
            console.log(err.message);
            setError('We could not load your account details. Check your connection and try again.')
        }
        setLoading(false)
    };

    useEffect(() => {
        if (!token) return;

        fun1();
    }, [token]);

    const statusClass = status === 'Confirm' ? 'alert-ok' : status === 'pending' || status === undefined ? 'alert-info' : 'alert-error'
    const statusLabel = status === 'Confirm' ? 'Approved' : status === 'pending' || status === undefined ? 'Waiting for review' : 'Not approved'

    return (
        <div className="page">
            <Header2 />
            <main className="page-body is-narrow">
                <h1 className="page-title">Your role</h1>

                {loading && <div className="skeleton ky-skel" aria-busy="true" aria-label="Loading your role" />}

                {!loading && error && (
                    <div className="alert alert-error ky-gap" role="alert">
                        <p>{error}</p>
                        <button type="button" className="btn btn-secondary btn-small ky-retry" onClick={() => { setLoading(true); fun1() }}>Try again</button>
                    </div>
                )}

                {!loading && !error && (
                    <div className="stack ky-gap">
                        {msgVisible === true && (
                            <div className={`alert ${statusClass}`} role="status">
                                <strong className="ky-status">{statusLabel}</strong>
                                <p>{msg}</p>
                            </div>
                        )}

                        <div className="card is-flat">
                            <p className="hint">You are signed in as</p>
                            <p className="section-title">{ROLE_NAMES[userRole] || userRole}</p>
                        </div>

                        {userRole === 'Customer' && (
                            <section className="stack" aria-labelledby="ky-options">
                                <h2 id="ky-options" className="section-title">Want to do more?</h2>
                                <ul className="ky-list">
                                    {OPTIONS.map((option) => (
                                        <li key={option.requestof} className="card ky-option">
                                            <h3>{option.title}</h3>
                                            <p>{option.text}</p>
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    navigate("/requestform", {
                                                        state: {
                                                            requestof: option.requestof
                                                        }
                                                    })
                                                }}
                                            >
                                                Send request
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}

export default Key
