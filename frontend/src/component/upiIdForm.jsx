import React, { useState } from 'react'
import "./upiIdForm.css"
import axios from "axios"

const UpiIdForm = ({ setUpiId: updateParentUpiId }) => {

    const [upiId, setUpiId] = useState("");
    const token = localStorage.getItem("token");

    const handleSubmit = async (e) => {
        e.preventDefault();

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

            alert(res.data.message);

            // update parent state
            updateParentUpiId(upiId);

        } catch (err) {
            console.log(err);
        }
    };


    return (
        <div id='upiidformmainbox'>
            <div id='dataenterandsubmit'>
                <p>Enter Your upiid to get money withdrawal in future</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="Enter UPI ID"
                    />

                    <button type="submit">
                        Submit
                    </button>
                </form>

            </div>
        </div>
    )
}

export default UpiIdForm