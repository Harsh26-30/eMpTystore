import React, { useState } from 'react'
import './addAddress.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const addAddress = () => {
    const navigate = useNavigate();
      const token = localStorage.getItem("token");
    const [address, setaddress] = useState('')
    const [country, setcountry] = useState('')
    const [state, setstate] = useState('')
    const [district, setdistrict] = useState('')
    const [pincode, setpincode] = useState('')

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

        if(res.data.Alright === true){
            navigate("/home");
        }
    }
    return (
        <div id='mainboxaddAddress'>
            <div id='addAddressbox2'>
            <form id='formaddAddress' onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Address</legend>
                    <input type="text" value={address} onChange={(e) => setaddress(e.target.value)} />
                </fieldset>
                <fieldset>
                    <legend>country</legend>
                    <select id='inputaddAddress' onChange={(e) => setcountry(e.target.value)}>
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
                <button type='submit'>Next</button>
            </form>
            </div>
        </div>
    )
}

export default addAddress