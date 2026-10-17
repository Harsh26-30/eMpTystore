import React, { useState } from 'react'
import "./upiIdForm.css"
import axios from "axios"

const UpiIdForm = ({ setUpiId: updateParentUpiId }) => {

    const [upiId, setUpiId] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const token = localStorage.getItem("token");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!upiId.trim() || !upiId.includes("@")) {
            setError("Enter a valid UPI ID, for example name@bank.");
            return;
        }

        setError("");
        setSuccess("");
        setSubmitting(true);

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/updateupiid`,
                {
                    upiId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccess(res.data.message);

            // update parent state
            updateParentUpiId(upiId);

        } catch (err) {
            console.log(err);
            setError(
                err?.response?.data?.message
                    ? `${err.response.data.message}. Please check it and try again.`
                    : "We could not save your UPI ID. Check your connection and try again."
            );
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <section className="card uf-card" aria-labelledby="uf-title">
            <h2 id="uf-title" className="uf-title">Add your UPI ID</h2>
            <p className="uf-text">We send your withdrawals to this UPI ID. You only need to add it once.</p>

            <form className="uf-form" onSubmit={handleSubmit} noValidate>
                <div className="field">
                    <label className="label" htmlFor="uf-upi-id">UPI ID</label>
                    <input
                        id="uf-upi-id"
                        className="input"
                        type="text"
                        inputMode="email"
                        autoComplete="off"
                        autoCapitalize="none"
                        spellCheck="false"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="name@bank"
                        aria-invalid={error ? "true" : undefined}
                        aria-describedby="uf-hint"
                    />
                    <span id="uf-hint" className="hint">For example 9876543210@upi</span>
                </div>

                {error && <p className="alert alert-error" role="alert">{error}</p>}
                {success && <p className="alert alert-ok" role="status">{success}</p>}

                <button type="submit" className="btn btn-primary btn-block uf-submit" disabled={submitting}>
                    {submitting ? "Saving…" : "Save UPI ID"}
                </button>
            </form>
        </section>
    )
}

export default UpiIdForm
