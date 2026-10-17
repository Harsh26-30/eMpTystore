import React, { useRef } from 'react'
import './Request.css'
import Header2 from './header2'
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';

const ROLE_NAMES = {
    Seller: 'Seller',
    Delivery_partner: 'Delivery partner',
};

const Request = () => {
    const token = localStorage.getItem("token");
    const [requests, setrequests] = useState([]);
    const [showImage, setShowImage] = useState(null);

    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [pendingAction, setPendingAction] = useState(null); // { type: 'confirm' | 'reject', request }
    const [busy, setBusy] = useState(false);
    const [notice, setNotice] = useState(null);
    const noticeTimer = useRef(null);

    const showNotice = (text, tone = 'ok') => {
        setNotice({ text, tone });
        clearTimeout(noticeTimer.current);
        noticeTimer.current = setTimeout(() => setNotice(null), 4500);
    };

    const fetchRequest = async () => {
        try {
            setLoadError('');

            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/roleUpgradeRequest`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setrequests(res.data.requests || []);
        } catch (err) {
            console.error(err);
            setLoadError('We could not load the requests. Check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequest();
        return () => clearTimeout(noticeTimer.current);
    }, [token]);

    // Close the open dialog with Escape
    useEffect(() => {
        if (!showImage && !pendingAction) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape') {
                setShowImage(null);
                if (!busy) setPendingAction(null);
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [showImage, pendingAction, busy]);

    const handleconfirm = async (upgradeTo, emailid, requestid) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/updateuserrole`,
                {
                    upgradeTo,
                    emailid,
                    requestid,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            showNotice(`${emailid} is now a ${ROLE_NAMES[upgradeTo] || upgradeTo}.`);
            fetchRequest();
        } catch (err) {
            console.error(err);
            showNotice('We could not approve this request. Please try again.', 'error');
        }
    };

    const handlereject = async (requestid) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/rejectuserroleupgraderequest`, {
                requestid
            },
                // empty body
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            showNotice('Request rejected.');
            fetchRequest();
        } catch (err) {
            console.error(err);
            showNotice('We could not reject this request. Please try again.', 'error');
        }
    }

    const runPending = async () => {
        if (!pendingAction) return;
        const { type, request } = pendingAction;
        setBusy(true);
        if (type === 'confirm') {
            await handleconfirm(request.requestof, request.email, request._id);
        } else {
            await handlereject(request._id);
        }
        setBusy(false);
        setPendingAction(null);
    };

    const pending = Array.isArray(requests)
        ? requests.filter((request) => request.requestStatus === "pending")
        : [];

    const details = (request) => [
        ['Email', request.email],
        ['Phone', request.phoneNo],
        ['Country', request.country],
        ['State', request.state],
        ['District', request.district],
        ['Pincode', request.pincode],
        ['UPI ID', request.upiId],
    ];

    return (
        <div className="page">
            <Header2 />
            <main className="page-body">
                <h1 className="page-title">Role requests</h1>
                <p className="page-lead">Check each person's documents before you approve them.</p>

                {loading && (
                    <div className="rq-grid rq-gap" aria-busy="true" aria-label="Loading requests">
                        {[0, 1, 2].map((i) => <div key={i} className="skeleton rq-skel" />)}
                    </div>
                )}

                {!loading && loadError && (
                    <div className="alert alert-error rq-gap" role="alert">
                        <p>{loadError}</p>
                        <button type="button" className="btn btn-secondary btn-small rq-retry" onClick={() => { setLoading(true); fetchRequest(); }}>
                            Try again
                        </button>
                    </div>
                )}

                {!loading && !loadError && pending.length === 0 && (
                    <div className="empty-state rq-gap">
                        <p>There are no pending requests. New requests will show up here.</p>
                    </div>
                )}

                {!loading && !loadError && pending.length > 0 && (
                    <ul className="rq-grid rq-gap" aria-label="Pending requests">
                        {pending.map((request) => (
                            <li key={request._id} className="card rq-card">
                                <div className="row is-between">
                                    <h2 className="rq-name">{request.email}</h2>
                                    <span className="pill pill-warn">Wants to be {ROLE_NAMES[request.requestof] || request.requestof}</span>
                                </div>

                                <dl className="rq-details">
                                    {details(request).slice(1).map(([label, value]) => (
                                        <div key={label}>
                                            <dt>{label}</dt>
                                            <dd>{value || 'Not given'}</dd>
                                        </div>
                                    ))}
                                </dl>

                                <div className="rq-docs">
                                    <button type="button" className="btn btn-secondary btn-small" onClick={() => setShowImage({ src: request.aadhaarImage, title: 'Aadhaar card' })}>
                                        View Aadhaar card
                                    </button>
                                    <button type="button" className="btn btn-secondary btn-small" onClick={() => setShowImage({ src: request.panImage, title: 'PAN card' })}>
                                        View PAN card
                                    </button>
                                </div>

                                <div className="rq-actions">
                                    <button type="button" className="btn btn-danger" onClick={() => setPendingAction({ type: 'reject', request })}>
                                        Reject
                                    </button>
                                    <a className="btn btn-secondary" href={`tel:${request.phoneNo}`}>Call</a>
                                    <button type="button" className="btn btn-primary" onClick={() => setPendingAction({ type: 'confirm', request })}>
                                        Approve
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </main>

            {showImage && (
                <div className="modal-backdrop" onClick={() => setShowImage(null)}>
                    <div
                        className="modal rq-doc"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="rq-doc-title"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 id="rq-doc-title">{showImage.title}</h2>
                        {showImage.src
                            ? <img src={showImage.src} alt={showImage.title} />
                            : <p>No image was uploaded for this document.</p>}
                        <button type="button" className="modal-secondary" onClick={() => setShowImage(null)} autoFocus>Close</button>
                    </div>
                </div>
            )}

            {pendingAction && (
                <div className="modal-backdrop">
                    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="rq-confirm-title">
                        <h2 id="rq-confirm-title">
                            {pendingAction.type === 'confirm' ? 'Approve this request?' : 'Reject this request?'}
                        </h2>
                        <p>
                            {pendingAction.type === 'confirm'
                                ? `${pendingAction.request.email} will become a ${ROLE_NAMES[pendingAction.request.requestof] || pendingAction.request.requestof}.`
                                : `${pendingAction.request.email} will be told the request was not approved.`}
                        </p>
                        <button type="button" className="modal-primary" onClick={runPending} disabled={busy}>
                            {busy ? 'Please wait…' : pendingAction.type === 'confirm' ? 'Yes, approve' : 'Yes, reject'}
                        </button>
                        <button type="button" className="modal-secondary" onClick={() => setPendingAction(null)} disabled={busy} autoFocus>
                            Go back
                        </button>
                    </div>
                </div>
            )}

            <div role="status" aria-live="polite">
                {notice && <div className={`toast rq-toast ${notice.tone === 'error' ? 'is-error' : ''}`}>{notice.text}</div>}
            </div>
        </div>
    )
}

export default Request
