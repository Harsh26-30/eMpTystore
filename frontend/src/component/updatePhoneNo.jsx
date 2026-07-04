import React, { useState } from 'react';
import axios from 'axios';
import './updatePhoneNo.css';

const UpdatePhoneNo = ({fun1}) => {
    const token = localStorage.getItem("token");
    const [phoneNo, setPhoneNo] = useState("");

    const handleSubmit = async () => {
        if (phoneNo.length !== 10) {
            alert("Please enter a valid 10-digit phone number.");
            return;
        }

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/updatePhoneNo`,
                { phoneNo },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert(res.data.message);
            await fun1();
        }catch (err) {
    console.log(err);
    console.log(err.message);
    console.log(err.code);

    alert(err.message);
}
    };

    return (
        <div id="mainboxupdatePhoneNo">
            <div id="box2updatePhoneNo">
                <p> You Have Been Report for <br />
                     giving Wrong Contact So <br />
                     Enter Correct Phone Number</p>
                <input
                    type="tel"
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value)}
                    placeholder="Enter Phone Number"
                    maxLength={10}
                />

                <button onClick={handleSubmit}>
                    Submit
                </button>
            </div>
        </div>
    );
};

export default UpdatePhoneNo;