import React from 'react'
import './buynow.css'
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const buynow = () => {
    // const [information, setinformation] = useState('')
    const [address, setaddress] = useState('')
    const [country, setcountry] = useState('')
    const [state, setstate] = useState('')
    const [district, setdistrict] = useState('')
    const [pincode, setpincode] = useState('')
    const [paymentmethod, setpaymentmethod] = useState('PN')

    const [p, setp] = useState('PN')





    const token = localStorage.getItem("token");
    useEffect(() => {
        if (!token) return;

        const fun1 = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:3000/checkuserinfo",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setaddress(res.data.address);
                setcountry(res.data.country);
                setstate(res.data.state);
                setdistrict(res.data.district);
                setpincode(res.data.pincode);

            } catch (err) {
                console.log("Error:", err);
            }
        };

        fun1();
    }, [token]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/updateaddress`, {
            address, country, state, district, pincode
        },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
    }

    return (
        <div id='mainboxbuynow'>
            <div id='box2buynow'>
                <h2>Delivary Address</h2>
                <form id='formbuynow' onSubmit={handleSubmit}>
                    <fieldset>
                        <legend>Address</legend>
                        <input type="text" value={address} onChange={(e) => setaddress(e.target.value)} />
                    </fieldset>
                    <fieldset>
                        <legend>country</legend>
                        <select id='inputbuynow' onChange={(e) => setcountry(e.target.value)}>
                            <option deafault>{country ? country : 'Select'}</option>
                            <option value="India">India</option>
                        </select>
                    </fieldset>                    <fieldset>
                        <legend>state</legend>
                        <input type="text" value={state} onChange={(e) => setstate(e.target.value)} />
                    </fieldset>                    <fieldset>
                        <legend>district</legend>
                        <input type="text" value={district} onChange={(e) => setdistrict(e.target.value)} />
                    </fieldset>                    <fieldset>
                        <legend>pincode</legend>
                        <input type="text" value={pincode} onChange={(e) => setpincode(e.target.value)} />
                    </fieldset>

                    <button type='submit'>Save</button>
                </form>
                    <h2>Payment Method</h2>
                <div id='paymentmethodbox'>
                    <select onChange={(e) => { setpaymentmethod(e.target.value) }}>
                        <option deafault>Select</option>
                        <option value="POD">Pay On Deleviry</option>
                        <option value="PN">Pay Now</option>
                    </select>
                    {paymentmethod === 'PN' && <div>
                        <button>Pay & Placed order</button>
                    </div >}
                    {paymentmethod === 'POD' && <div>
                        <button>Placed order</button>
                    </div>}
                </div>

            </div>
        </div>
    )
}

export default buynow