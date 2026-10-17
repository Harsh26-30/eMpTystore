import React,{useState} from "react";
import "./requestform.css";
import { useLocation,useNavigate } from "react-router-dom";
import Header2 from "./header2";
import axios from 'axios'

const ROLE_NAMES = {
    Seller: "Seller",
    Delivery_partner: "Delivery partner",
};

const RequestForm = () => {
    const token = localStorage.getItem("token");

    const location = useLocation();

    const navigate = useNavigate()

    const requestof = location.state?.requestof || "Request";
    const roleName = ROLE_NAMES[requestof] || requestof;

    const [aadhaar, setAadhaar] = useState(null);
    const [pan, setPan] = useState(null);
    const [upiId, setUpiId] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [doneMsg, setDoneMsg] = useState("");

   const handlerequestkey = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData();

    formData.append("upgradeTo", requestof);
    formData.append("aadhaar", aadhaar);
    formData.append("pan", pan);
    formData.append("upiId", upiId);

    try {
        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/requestupdateuserrole`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        setDoneMsg(res.data.msg || "Your request has been sent.");

    } catch (err) {
        console.log(err.response?.data || err.message);
        setError(err.response?.data?.message || err.response?.data?.error || "We could not send your request. Check your documents and connection, then try again.");
    }
    setSubmitting(false);
};


    return (
        <div className="page">

            <Header2 />

            <main className="page-body is-narrow">
                <button type="button" className="back-link" onClick={() => navigate(-1)}>Back</button>
                <h1 className="page-title">Request to become a {roleName}</h1>
                <p className="page-lead">
                    We check your documents before changing your role. This usually takes 24 to 48 hours.
                </p>

                {doneMsg ? (
                    <div className="card rf-card" role="status">
                        <p className="alert alert-ok">{doneMsg}</p>
                        <button type="button" className="btn btn-primary btn-block" onClick={() => navigate(-1)}>Done</button>
                    </div>
                ) : (
                    <form className="card rf-card" onSubmit={handlerequestkey}>
                        <div className="field">
                            <label className="label" htmlFor="rf-aadhaar">Aadhaar card photo</label>
                            <input
                                required
                                id="rf-aadhaar"
                                className="input rf-file"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setAadhaar(e.target.files[0])}
                            />
                        </div>
                        <div className="field">
                            <label className="label" htmlFor="rf-pan">PAN card photo</label>
                            <input
                                required
                                id="rf-pan"
                                className="input rf-file"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setPan(e.target.files[0])}
                            />
                        </div>
                        <div className="field">
                            <label className="label" htmlFor="rf-upi">UPI ID</label>
                            <input
                                required
                                id="rf-upi"
                                className="input"
                                type="text"
                                autoComplete="off"
                                autoCapitalize="none"
                                aria-describedby="rf-upi-hint"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                            />
                            <span id="rf-upi-hint" className="hint">Your earnings are paid to this UPI ID, for example name@okaxis.</span>
                        </div>

                        {error && <p className="alert alert-error" role="alert">{error}</p>}

                        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                            {submitting ? "Sending request…" : "Send request"}
                        </button>
                    </form>
                )}
            </main>

        </div>
    );
};

export default RequestForm;
