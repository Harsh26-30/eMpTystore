import React, { useEffect, useState, useRef } from 'react';
import axios from "axios";
import "./deliveryorderdetail.css"
import QrScanner from "./QrScanner";
import { useNavigate } from "react-router-dom";

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
    const [orders, setorders] = useState(null);
    const [Currentuserid, setCurrentuserid] = useState('')
    const [showScanner, setShowScanner] = useState(false);
    const navigate = useNavigate();

    const prevPos = useRef(null);

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
            if (res2.data.dporders) {
                setmapvisblity(true);
            }

            setorders(res2.data.dporders)
            setCurrentuserid(res2.data.id)
            setmanagingOrder(res2.data.managingOrder);

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                setclat(position.coords.latitude);
                setclong(position.coords.longitude);
            },
            (error) => console.log(error),
            { enableHighAccuracy: true }
        );

        fetchData();

        return () => navigator.geolocation.clearWatch(watchId);
    }, [token]);


    if (clat == null || clong == null) return <div>Loading...</div>;
    const visibleOrders = orders
        ? (Array.isArray(orders) ? orders : [orders])
            .filter(o =>
                o?.shopcorrdinates?.latitude &&
                o?.shopcorrdinates?.longitude
            )
        : [];


    // Wait until data is fetched
    if (orders === null) {
        setTimeout(() => {
            fetchData()
        }, 10000);
        return <div id='ordersnull'>
            <video
                autoPlay
                loop
                muted
                playsInline
                width="100%"
                style={{
                    mixBlendMode: "soft-light"
                }}
            >
                <source src="\InShot_20260629_090941280.mp4" type="video/mp4" />
                <h2>Wait... Currently No Order Asign To You Keep Refresh The Page</h2>
            </video>
        </div>;
    }

    // No order assigned
    if (!managingOrder) {
        return (
            <div id="noAssignedOrder">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    width="100%"
                    style={{
                        mixBlendMode: "soft-light"
                    }}
                >
                    <source src="\InShot_20260629_090941280.mp4" type="video/mp4" />
                    <h2>Wait... Currently No Order Asign To You Keep Refresh The Page</h2>
                </video>
            </div>
        );
    }

    return (
        <div>
            {visibleOrders.map(order => (

                <div key={order._id} id="deliveryrequest">
                    <div id="box1">
                        <h5>Order Id: {order._id}</h5>
                        {managingOrder === order._id && order.delivery_partner_verification === "Verified" && <h5><a href={`tel:${order.phoneNo}`}>
                            Contact:- {order.phoneNo}
                        </a></h5>}
                        <h4>
                            {getDistance(
                                clat,
                                clong,
                                order?.shopcorrdinates?.latitude,
                                order?.shopcorrdinates?.longitude
                            )?.toFixed(2)} km
                        </h4>
                    </div>

                    <div id="box2">

                        {managingOrder === order._id && order.delivery_partner_verification === "Not Verified" && (
                            <button onClick={() => { setQrVusibility(true), setSelectedOrder(order) }}>
                                QR
                            </button>
                        )}
                        {managingOrder === order._id && order.delivery_partner_verification === "Verified" && <button
                            onClick={() => {
                                setSelectedOrder(order);
                                setShowScanner(true);
                            }}
                        >
                            Scan QR
                        </button>}
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
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                    }}
                >
                    <QrScanner
                        onScan={async (result) => {
                            try {
                                const scanned =
                                    typeof result === "string"
                                        ? result
                                        : result?.text;

                                console.log("Scanned:", scanned);
                                console.log("Selected:", selectedOrder);

                                if (String(scanned).trim() === String(selectedOrder._id).trim()) {
                                    await axios.post(
                                        `${import.meta.env.VITE_API_URL}/OrderReached`,
                                        {
                                            orderid: selectedOrder._id,
                                            dpid: Currentuserid,
                                        },
                                        {
                                            headers: {
                                                Authorization: `Bearer ${token}`,
                                            },
                                        }
                                    );

                                    setShowScanner(false);
                                } else {
                                    alert("Wrong QR");
                                    setShowScanner(false);
                                }
                            } catch (err) {
                                console.error("Scan Error:", err);
                            }
                        }}
                    />
                    <button
                        style={{
                            width: "70%",
                            borderRadius: "20px",
                            color: '#fff',
                            backgroundColor: "#000"
                        }}
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