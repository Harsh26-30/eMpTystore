import React, { useState } from 'react'
import './uploadcomponent.css';
import axios from 'axios';

const uploadcomponent = () => {
    const token = localStorage.getItem("token");

    const [Componentid, setComponentid] = useState('');
    const [Componentcode, setComponentcode] = useState('');
    const [msg, setmsg] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);


    const handlesubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setmsg('');
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/uploadui`,
                { Componentid, Componentcode },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setmsg(res.data.message || "Uploaded successfully");

        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || 'We could not upload this component. Check your connection and try again.');
        }
        setSubmitting(false);
    }
    return (
        <div className="page">
            <main className="page-body is-narrow">
                <h1 className="page-title">Upload a shop layout</h1>
                <p className="page-lead">Add a header or body layout that sellers can choose for their shop page.</p>

                <form className="card su-component" onSubmit={handlesubmit}>
                    <div className="field">
                        <label className="label" htmlFor="uc-id">Component ID</label>
                        <input id="uc-id" className="input" type="text" required aria-describedby="uc-id-hint" value={Componentid} onChange={(e) => { setComponentid(e.target.value) }} />
                        <span id="uc-id-hint" className="hint">Start with the type, for example header_1 or body_2.</span>
                    </div>
                    <div className="field">
                        <label className="label" htmlFor="codeinput">Component code (HTML)</label>
                        <textarea id="codeinput" className="input uc-code" required spellCheck="false" value={Componentcode} onChange={(e) => { setComponentcode(e.target.value) }}></textarea>
                    </div>

                    {error && <p className="alert alert-error" role="alert">{error}</p>}
                    {msg && <p className="alert alert-ok" role="status">{msg}</p>}

                    <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                        {submitting ? 'Uploading…' : 'Upload component'}
                    </button>
                </form>
            </main>
        </div>
    )
}

export default uploadcomponent
