import React, { useEffect, useState } from 'react'
import "./MakePayment.css"
import "./modal.css"
import Header2 from './header2'
import axios from "axios"

const MakePayment = () => {
    const token = localStorage.getItem("token");
    const [requests, setRequests] = useState([]);
    const [wallets, setWallets] = useState({});
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState(null); // { kind: 'paid' | 'reject', item }
    const [working, setWorking] = useState(false);
    const [notice, setNotice] = useState('');

    const showNotice = (text) => {
        setNotice(text);
        setTimeout(() => setNotice(''), 3500);
    };


    const fun1 = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/withdrawalrequest`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setRequests(res.data.withdrawals);

            res.data.withdrawals.forEach(item => {
                getUserWallet(item.userId);
            });

        } catch (error) {
            console.log(error.message);
            showNotice('We could not load the withdrawal requests. Refresh and try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fun1();
    }, []);

    // const handlePay = async (id) => {
    //     try {
    //         const res = await axios.post(
    //             `${import.meta.env.VITE_API_URL}/paytouser`,
    //             {
    //                 withdrawalId: id
    //             },
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             }
    //         );


    //     } catch (error) {
    //         console.log(error.response?.data || error.message);
    //     }
    // };

    const openUPI = (upiId, name, amount) => {

        const url =
            `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR`;

        window.location.href = url;
    }

    const handlepaid = async (userId, amount, requestId) => {
        setWorking(true);
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/updateuserwallet`,
                {
                    userId,
                    amount: Number(amount),
                    requestId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            showNotice("Payment confirmed and wallet updated.");
            fun1()

        } catch (error) {
            console.log(error.response?.data || error.message);
            showNotice("The wallet could not be updated. Try again.");
        } finally {
            setWorking(false);
            setConfirming(null);
        }
    };

    const getUserWallet = async (userId) => {
        try {

            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/userWallet/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setWallets(prev => ({
                ...prev,
                [userId]: res.data.wallet
            }));

        } catch (error) {
            console.log(error.message);
        }
    };

    const handlereject = async (requestId) => {
        setWorking(true);
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/rejectpayment`,
                {

                    requestId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            showNotice("Request rejected.");
            fun1()

        } catch (error) {
            console.log(error.response?.data || error.message);
            showNotice("The request could not be rejected. Try again.");
        } finally {
            setWorking(false);
            setConfirming(null);
        }

    }

    const pending = (requests || []).filter(item => item.status === "Pending");
    const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

    return (
        <div className="page">
            <Header2 />
            <main className="page-body is-narrow">
                <h1 className="page-title">Make payments</h1>
                <p className="page-lead">Pay each request with UPI, then mark it as paid to deduct the amount from the wallet.</p>

                {loading && (
                    <div className="stack mp-gap" aria-busy="true" aria-label="Loading requests">
                        <div className="skeleton" />
                        <div className="skeleton" />
                    </div>
                )}

                {!loading && pending.length === 0 && (
                    <div className="empty-state mp-gap">
                        <p>No pending withdrawal requests right now.</p>
                    </div>
                )}

                {!loading && pending.length > 0 && (
                    <ul className="mp-list">
                        {pending.map((item) => (
                            <li key={item._id} className="card mp-card">
                                <div className="mp-top">
                                    <h2 className="section-title">{item.username}</h2>
                                    <span className="mp-amount money">{money(item.amount)}</span>
                                </div>

                                <dl className="mp-details">
                                    <div><dt>Wallet balance</dt><dd className="money">{wallets[item.userId] !== undefined ? money(wallets[item.userId]) : 'Loading…'}</dd></div>
                                    <div><dt>UPI ID</dt><dd>{item.paymentDetails?.upiId || 'Not provided'}</dd></div>
                                    <div><dt>Email</dt><dd>{item.useremail}</dd></div>
                                    <div><dt>Phone</dt><dd><a href={`tel:${item.userphoneno}`}>{item.userphoneno}</a></dd></div>
                                </dl>

                                <div className="mp-actions">
                                    <button type="button" className="btn btn-danger btn-small" onClick={() => setConfirming({ kind: 'reject', item })}>
                                        Reject
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary btn-small"
                                        onClick={() => openUPI(item.paymentDetails?.upiId, item.username, item.amount)}
                                        disabled={!item.paymentDetails?.upiId}
                                    >
                                        Pay with UPI
                                    </button>
                                    <button type="button" className="btn btn-primary btn-small" onClick={() => setConfirming({ kind: 'paid', item })}>
                                        Mark as paid
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </main>

            {confirming && (
                <div className="modal-backdrop" onClick={() => !working && setConfirming(null)}>
                    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="mp-confirm-title" onClick={(e) => e.stopPropagation()}>
                        {confirming.kind === 'paid' ? (
                            <>
                                <h2 id="mp-confirm-title">Mark as paid?</h2>
                                <p>{money(confirming.item.amount)} will be deducted from {confirming.item.username}'s wallet. Only do this after you have paid them.</p>
                                <button type="button" className="modal-primary" disabled={working} onClick={() => handlepaid(confirming.item.userId, confirming.item.amount, confirming.item._id)}>
                                    {working ? 'Updating…' : 'Yes, mark as paid'}
                                </button>
                            </>
                        ) : (
                            <>
                                <h2 id="mp-confirm-title">Reject this request?</h2>
                                <p>{confirming.item.username}'s request for {money(confirming.item.amount)} will be rejected. Their wallet is not changed.</p>
                                <button type="button" className="modal-primary" disabled={working} onClick={() => handlereject(confirming.item._id)}>
                                    {working ? 'Rejecting…' : 'Yes, reject'}
                                </button>
                            </>
                        )}
                        <button type="button" className="modal-secondary" disabled={working} onClick={() => setConfirming(null)}>Cancel</button>
                    </div>
                </div>
            )}

            {notice && <p className="toast" role="status">{notice}</p>}
        </div>
    )
}

export default MakePayment