import React, { useEffect, useRef, useState } from 'react';
import './rejectpOrderform.css';
import axios from 'axios';

// value is what the server stores; label is what the seller reads
const REASONS = [
    { value: "Not Interested", label: "Customer is not interested" },
    { value: "Out of Stock", label: "Out of stock" },
    { value: "Call Not Reached", label: "Could not reach the customer by phone" },
    { value: "Wrong Contact", label: "Wrong phone number" },
];

const RejectpOrderform = ({fetchOrders,orderid,setrejectpOrderform}) => {
    const token = localStorage.getItem("token");
    const [selectedReason, setSelectedReason] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const dialogRef = useRef(null);

    useEffect(() => {
        dialogRef.current?.focus();
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKey = (e) => { if (e.key === 'Escape') setrejectpOrderform(false); };
        document.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = previous;
            document.removeEventListener('keydown', onKey);
        };
    }, []);

    const handleReject = async () => {
        if (!selectedReason) {
            setError("Choose a reason before you reject this order.");
            return;
        }

        setSubmitting(true);
        setError("");
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/handlerejectorder`,{
                    selectedReason,orderid
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "We could not reject this order. Check your connection and try again.");
            setSubmitting(false);
            return;
        }
        fetchOrders();
        setrejectpOrderform(false)
    };

    return (
        <div className="sr-backdrop">
            <div
                className="sr-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="sr-title"
                tabIndex={-1}
                ref={dialogRef}
            >
                <h2 id="sr-title">Reject this order?</h2>
                <p className="sr-lead">
                    Tell us why. The customer will see that the order was rejected. You cannot undo this.
                </p>

                <fieldset className="sr-reasons" aria-describedby={error ? 'sr-error' : undefined}>
                    <legend>Reason for rejecting</legend>
                    {REASONS.map((reason, i) => (
                        <div key={reason.value} className="sr-choice">
                            <input
                                id={`sr-reason-${i}`}
                                type="radio"
                                name="sr-reason"
                                value={reason.value}
                                checked={selectedReason === reason.value}
                                onChange={(e) => { setSelectedReason(e.target.value); setError(""); }}
                            />
                            <label htmlFor={`sr-reason-${i}`}>{reason.label}</label>
                        </div>
                    ))}
                </fieldset>

                {selectedReason === "Wrong Contact" && (
                    <p className="sr-note">
                        The customer's phone number will be marked as not verified, so they will need to verify it again.
                    </p>
                )}

                {error && <p id="sr-error" className="sr-error" role="alert">{error}</p>}

                <div className="sr-actions">
                    <button type="button" className="sr-btn sr-btn-secondary" onClick={() => setrejectpOrderform(false)} disabled={submitting}>
                        Keep order
                    </button>
                    <button type="button" className="sr-btn sr-btn-danger" onClick={handleReject} disabled={submitting}>
                        {submitting ? 'Rejecting…' : 'Reject order'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RejectpOrderform;
