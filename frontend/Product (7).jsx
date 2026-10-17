import React,{useState,useEffect} from 'react'
import "./walletwithdrawbtn.css"
import axios from 'axios';

const walletwithdrawbtn = () => {
    const token = localStorage.getItem("token");
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [notice, setNotice] = useState(null);

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
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fun();
    }, []);
    const handleWithdraw = async () => {
        setSubmitting(true);
        setNotice(null);
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/withdrawWallet`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setNotice({ type: 'ok', text: res.data.message });
            setConfirming(false);
            fun();

        } catch (err) {
            console.log(err);
            setNotice({
                type: 'error',
                text: err?.response?.data?.message
                    ? `${err.response.data.message}. Please try again.`
                    : 'We could not send your withdrawal request. Check your connection and try again.',
            });
            setConfirming(false);
        } finally {
            setSubmitting(false);
        }
    };

    const canWithdraw = amount > 49;
    const shown = `₹${Number(amount || 0).toLocaleString('en-IN')}`;

    return (
        <section className="card wb-card" aria-labelledby="wb-title">
            <h2 id="wb-title" className="wb-title">Withdraw money</h2>

            {notice && (
                <p className={notice.type === 'ok' ? 'alert alert-ok' : 'alert alert-error'} role={notice.type === 'ok' ? 'status' : 'alert'}>
                    {notice.text}
                </p>
            )}

            {loading ? (
                <p className="wb-text">Checking your balance…</p>
            ) : !canWithdraw ? (
                <p className="wb-text wb-min">The minimum withdrawal is ₹50. Keep earning and you can withdraw soon.</p>
            ) : confirming ? (
                <div className="wb-confirm" role="group" aria-labelledby="wb-confirm-text">
                    <p id="wb-confirm-text" className="wb-text">
                        Withdraw {shown} to your UPI ID? Money can take up to 5 days to arrive.
                    </p>
                    <div className="wb-actions">
                        <button type="button" className="btn btn-primary btn-block wb-big" onClick={handleWithdraw} disabled={submitting}>
                            {submitting ? 'Sending request…' : `Yes, withdraw ${shown}`}
                        </button>
                        <button type="button" className="btn btn-secondary btn-block wb-big" onClick={() => setConfirming(false)} disabled={submitting}>
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <button type="button" className="btn btn-primary btn-block wb-big" onClick={() => { setNotice(null); setConfirming(true); }}>
                    Withdraw to UPI
                </button>
            )}
        </section>
    )
}

export default walletwithdrawbtn
