import React, { useEffect, useState, useRef } from 'react';
import axios from "axios";
import "./deliveryorderdetail.css"

const DeliveryOrderDetail = ({ orders ,setQrVusibility,setSelectedOrder}) => {
    const token = localStorage.getItem("token");
    const [clat, setclat] = useState(null);
    const [clong, setclong] = useState(null);
    const [managingOrder, setmanagingOrder] = useState('');
    const [scannerOrder, setScannerOrder] = useState(null);
    const [Currentuserid,setCurrentuserid] = useState('')

    const prevPos = useRef(null);

    const handleAcept = async (order) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/aceptdelivery`,
                { orderId: order._id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

        } catch (err) {
            console.log(err);
        }
    };

    function getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    useEffect( () => {
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                setclat(position.coords.latitude);
                setclong(position.coords.longitude);
            },
            (error) => console.log(error),
            { enableHighAccuracy: true }
        );

            const fetchData = async () => {
        try {
            const res2 = await axios.get(
                `${import.meta.env.VITE_API_URL}/checkuserinfo`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setCurrentuserid(res2.data.id)
            setmanagingOrder(res2.data.managingOrder);
        } catch (err) {
            console.log(err);
        }
    };

    fetchData();



        return () => navigator.geolocation.clearWatch(watchId);
    }, [token]);
    

    if (!clat || !clong) return <div>Loading...</div>;

    const visibleOrders = Array.isArray(orders)
        ? orders.filter(order => order.orderstatus === "RFD")
        : [];

const visibleOrders2 = Array.isArray(orders)
  ? orders.filter(order =>
      Currentuserid &&
      order.orderstatus === "OFD" &&
      order.delivery_partner === Currentuserid &&
      order.delivery_partner_verification === "Verified"
    )
  : [];

    return (
        <div>

            {visibleOrders.map(order => (
                <div key={order._id} id="deliveryrequest">

                    <div id="box1">
                        <h5>Order Id: {order._id}</h5>
                        <h4>
                            {getDistance(
                                clat,
                                clong,
                                order.shopcorrdinates.latitude,
                                order.shopcorrdinates.longitude
                            ).toFixed(2)} km
                        </h4>
                    </div>

                    <div id="box2">

                        {!managingOrder && (
                            <button onClick={() => handleAcept(order)}>
                                Accept
                            </button>
                        )}

                        {managingOrder === order._id && (
                            <button onClick={() =>{ setQrVusibility(true),setSelectedOrder(order)}}>
                                QR
                            </button>
                        )}

                        {managingOrder === order._id &&
                            order.delivery_partner_verification === "Verified" && (
                                <button onClick={() => setScannerOrder(order)}>
                                    Scan QR
                                </button>
                            )}

                    </div>

                    

                </div>
                
            ))}

             {visibleOrders2.map(order => (
                <div key={order._id} id="deliveryrequest">

                    <div id="box1">
                        <h5>Order Id: {order._id}</h5>
                        <h4>
                            {getDistance(
                                clat,
                                clong,
                                order.shopcorrdinates.latitude,
                                order.shopcorrdinates.longitude
                            ).toFixed(2)} km
                        </h4>
                    </div>

                    <div id="box2">

                        {managingOrder === order._id &&
                            order.delivery_partner_verification === "Verified" && (
                                <button onClick={() => setScannerOrder(order)}>
                                    Scan QR
                                </button>
                            )}

                    </div>
                </div>
                
            ))}

            
        </div>
    );
};

export default DeliveryOrderDetail;