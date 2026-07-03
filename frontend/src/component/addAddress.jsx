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

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/updateaddress`,
                { address, country, state, district, pincode },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(res.data); // debug

            if (res.data.success) {
                navigate("/home");
            }

        } catch (err) {
            console.log(err.response?.data || err.message);
        }
    };

    const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {
                const res = await axios.get(
                    "https://nominatim.openstreetmap.org/reverse",
                    {
                        params: {
                            lat,
                            lon,
                            format: "jsonv2",
                            addressdetails: 1,
                        },
                        headers: {
                            "Accept-Language": "en",
                        },
                    }
                );

                const a = res.data.address;

                setcountry(a.country || "");
                setstate(a.state || "");

                setdistrict(
                    a.state_district ||
                    a.county ||
                    a.city_district ||
                    a.city ||
                    ""
                );

                setpincode(a.postcode || "");

            } catch (err) {
                console.error(err);
                alert("Unable to fetch address.");
            }
        },
        (error) => {
            console.error(error);
            alert("Unable to get your current location.");
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
        }
    );
};

    return (
        <div id='mainboxaddAddress'>
            <div id='addAddressbox2'>
                <form id='formaddAddress' onSubmit={handleSubmit}>
                    <fieldset>
                        <legend>Address</legend>
                        <input required type="text" value={address} onChange={(e) => setaddress(e.target.value)} />
                    </fieldset>
                    <fieldset>
                        <legend>country</legend>
                        <select required id='inputaddAddress' onChange={(e) => setcountry(e.target.value)}>
                            <option deafault>{country ? country : 'Select'}</option>
                            <option value="India">India</option>
                        </select>
                    </fieldset>                    <fieldset>
                        <legend>state</legend>
                        <input required type="text" value={state} onChange={(e) => setstate(e.target.value)} />
                    </fieldset>                    <fieldset>
                        <legend>district</legend>
                        <input required type="text" value={district} onChange={(e) => setdistrict(e.target.value)} />
                    </fieldset>                    <fieldset>
                        <legend>pincode</legend>
                        <input required type="text" value={pincode} onChange={(e) => setpincode(e.target.value)} />
                    </fieldset>

                    <button type='submit'>Submit</button>
                    <div id='buttonboxaddAddress'>
                        <button onClick={handleUseCurrentLocation}>Use Current Location</button>
                    </div>

                </form>
            </div>
        </div>
    )
}


export default addAddress