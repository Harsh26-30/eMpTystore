import React, { useState } from 'react';
import './rejectpOrderform.css';
import axios from 'axios';

const RejectpOrderform = ({fetchOrders,orderid,setrejectpOrderform}) => {
    const token = localStorage.getItem("token");
    const [selectedReason, setSelectedReason] = useState("");

    const handleReject = async () => {
        if (!selectedReason) {
            alert("Please select a reason.");
            return;
        }

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
        fetchOrders();
        setrejectpOrderform(false)

        console.log("Selected reason for rejection:", selectedReason);

    };

    return (
        <div id='mainboxrejectpOrderform'>
            <div id='box2rejectpOrderform'>
                <h2>Reject Order</h2>

                <p>Please select a reason for rejecting the order:</p>
                <p>Note: Once you reject the order, it cannot be undone.</p>

                <select
                    id='selectrejectpOrderform'
                    value={selectedReason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                >
                    <option value="" disabled>
                        Select Reason
                    </option>
                    <option value="Not Interested">Not Interested</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Call Not Reached">Call Not Reached</option>
                    <option value="Wrong Contact">Wrong Contact</option>
                </select>

                <button
                    onClick={handleReject}
                    id='submitrejectpOrderform'
                >
                    Reject
                </button>
            </div>
        </div>
    );
};

export default RejectpOrderform;