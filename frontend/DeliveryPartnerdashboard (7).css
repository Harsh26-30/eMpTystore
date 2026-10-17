import React, { useState, useEffect } from 'react'
import axios from 'axios';
import "./wallettotalamount.css"

const wallettotalamount = () => {
    const token = localStorage.getItem("token");
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fun = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/walletTotalAmount`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setAmount(res.data.Wallet);
            setError('');
        } catch (err) {
            console.log(err);
            setError('We could not load your balance. Check your connection and refresh the page.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fun();
    }, []);

    return (
        <section className="wt-card" aria-labelledby="wt-title">
            <h2 id="wt-title" className="wt-title">Wallet balance</h2>
            {loading ? (
                <div className="skeleton wt-skeleton" role="status" aria-label="Loading balance" />
            ) : error ? (
                <p className="alert alert-error" role="alert">{error}</p>
            ) : (
                <p className="wt-amount">₹{Number(amount || 0).toLocaleString('en-IN')}</p>
            )}
            <p className="wt-note">Your earnings so far. You can withdraw once you have ₹50 or more.</p>
        </section>
    )
}

export default wallettotalamount
