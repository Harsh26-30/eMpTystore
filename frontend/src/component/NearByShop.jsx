import React, { useState, useEffect } from 'react'
import './NearByShop.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const NearByShop = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [shops, setShops] = useState([]);
    const [clat, setclat] = useState('')
    const [clong, setclong] = useState('')


    useEffect(() => {
        const fun1 = async () => {
            console.log('work f');

            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/allshops`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setShops(Array.isArray(res.data.shops) ? res.data.shops : []);

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const clatitude = position.coords.latitude;
                        const clongitude = position.coords.longitude;
                        setclat(clatitude)
                        setclong(clongitude)
                    },
                    (error) => {
                        console.log(error.message);
                    }
                );

            } catch (err) {
                console.log(err);
            }
        };

        fun1();

    }, [token]);


    function getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;

        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    return (
        <div id='mainboxnearbyshop'>

            {shops.length > 0 ? (shops.map((shop, index) => (
                <div id='Shopnoxs'
                    style={{
                        opacity: shop.shopOpenOrNot === 'Closed' ? 0.4 : 1,
                        backgroundColor: shop.ui.generalinfo.BackgroundColor || "transparent",
                        backgroundImage: shop.ui.generalinfo.Backgroundimage
                            ? `url(${shop.ui.generalinfo.Backgroundimage})`
                            : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat"
                    }}
                    key={index} onClick={() => {
                        shop.shopOpenOrNot === 'Open' ?
                            navigate("/Shopnox", {
                                state: {
                                    id: shop._id
                                }
                            }) : alert(`${shop.ui.generalinfo.BusinessName} is closed Currently`)
                    }}>
                    <h3 style={{ color: shop.ui.generalinfo.TextColor }}>{shop.ui.generalinfo.BusinessName}</h3>
                    <h4>
                        {getDistance(
                            clat,
                            clong,
                            shop.shoplatitude,
                            shop.shoplongitude
                        ).toFixed(2) ?? 'Not Defined'} km
                    </h4>
                </div>
            ))) : <></>}

        </div>
    )
}

export default NearByShop