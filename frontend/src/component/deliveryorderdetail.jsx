import React, { useEffect, useState, useRef } from 'react';
import axios from "axios";
import "./deliveryorderdetail.css"
import QrScanner from "./QrScanner";

const DeliveryOrderDetail = ({
    setQrVusibility,
    setSelectedOrder,
    selectedOrder,
    setmapvisblity
}) => {
    const token = localStorage.getItem("token");
    const [clat, setclat] = useState(null);
    const [clong, setclong] = useState(null);
    const [managingOrder, setmanagingOrder] = useState('');
    const [scannerOrder, setScannerOrder] = useState(null);
    const [orders, setorders] = useState(null);
    const [Currentuserid, setCurrentuserid] = useState('')
    const [showScanner, setShowScanner] = useState(false);

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

    useEffect(() => {
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
                console.log("API id:", res2.data.id);
                console.log("orders", res2.data.dporders);
                if (orders) {
                    setmapvisblity(true)
                }

                setorders(res2.data.dporders)
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

    const visibleOrders = orders
        ? (Array.isArray(orders) ? orders : [orders])
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

                        {managingOrder === order._id && order.delivery_partner_verification === "" && (
                            <button onClick={() => { setQrVusibility(true), setSelectedOrder(order) }}>
                                QR
                            </button>
                        )}

                        <button
                            onClick={() => {
                                setSelectedOrder(order);
                                setShowScanner(true);
                            }}
                        >
                            Scan QR
                        </button>


                    </div>

                </div>

            ))}
            {showScanner && selectedOrder && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(0,0,0,0.7)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                    }}
                >
                    <QrScanner
                        onScan={(result) => {
                            const scanned =
                                typeof result === "string"
                                    ? result
                                    : result?.text;

                            console.log("Scanned:", scanned);
                            console.log("Expected:", selectedOrder._id);

                            if (scanned === String(selectedOrder._id)) {
                                alert("Correct QR ✔");
                            } else {
                                alert("Wrong QR ❌");
                            }

                            setShowScanner(false);
                        }
                    />

                    <button
                        onClick={() => {
                            setShowScanner(false);
                        }}
                    >
                        Close
                    </button>
                </div>
            )}

        </div>
    );
};

export default DeliveryOrderDetail;