import React, { useEffect, useState, useRef } from 'react';
import axios from "axios";
import "./deliveryorderdetail.css"
import QrScanner from "./QrScanner";
import { useNavigate } from "react-router-dom";

const DeliveryOrderDetail = ({
    setQrVusibility,
    setSelectedOrder,
    selectedOrder,
    setmapvisblity,
    setdestlong,
    setdestlat
}) => {
    const token = localStorage.getItem("token");
    const [clat, setclat] = useState(null);
    const [clong, setclong] = useState(null);
    const [managingOrder, setmanagingOrder] = useState('');
    const [orders, setorders] = useState(null);
    const [Currentuserid, setCurrentuserid] = useState('')
    const [showScanner, setShowScanner] = useState(false);
    const [notice, setNotice] = useState(null);
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
            setdestlong(res2.data.slong)
            setdestlat(res2.data.slat)

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


    if (clat == null || clong == null) {
        return (
            <section className="card dod-panel">
                <p className="dod-status" role="status">Finding your location…</p>
            </section>
        );
    }
    const visibleOrders = orders
        ? (Array.isArray(orders) ? orders : [orders])
            .filter(o =>
                o?.shopcorrdinates?.latitude &&
                o?.shopcorrdinates?.longitude
            )
        : [];

    const noticeEl = notice && (
        <p className={notice.type === 'ok' ? 'alert alert-ok' : 'alert alert-error'} role={notice.type === 'ok' ? 'status' : 'alert'}>
            {notice.text}
        </p>
    );

    const emptyState = (
        <div className="dod-wrap">
        {noticeEl}
        <section className="empty-state dod-empty" aria-labelledby="dod-empty-title">
            <video
                className="dod-video"
                autoPlay
                loop
                muted
                playsInline
                aria-hidden="true"
            >
                <source src="/InShot_20260629_090941280.mp4" type="video/mp4" />
            </video>
            <h2 id="dod-empty-title" className="dod-empty-title">No delivery assigned yet</h2>
            <p className="dod-empty-text">
                Stay on this page. When a shop sends you an order it will show up here
                automatically.
            </p>
        </section>
        </div>
    );

    // Wait until data is fetched
    if (orders === null) {
        setTimeout(() => {
            fetchData()
        }, 10000);
        return emptyState;
    }

    // No order assigned
    if (!managingOrder) {
        return emptyState;
    }

    const rupees = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

    const handleScan = async (result) => {
        const scanned =
            typeof result === "string"
                ? result
                : result?.text;

        if (String(scanned).trim() === String(selectedOrder._id).trim()) {
            try {
                await axios.post(
                    `${import.meta.env.VITE_API_URL}/OrderReached`, {
                    orderid: selectedOrder._id,
                    dpid: Currentuserid
                },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setNotice({ type: 'ok', text: 'QR code matched. Delivery completed and your earnings were added to your wallet.' });
                setShowScanner(false);
                fetchData();

                navigate("/home");
            } catch (err) {
                console.log(err);
                setNotice({ type: 'error', text: 'The QR code matched, but we could not complete the delivery. Check your connection and scan again.' });
                setShowScanner(false);
            }
        } else {
            setNotice({ type: 'error', text: 'That QR code is for a different order. Ask the customer to open this order in their app and scan again.' });
            setShowScanner(false);
            navigate("/home");
        }
    };

    return (
        <div className="dod-wrap">
            {noticeEl}

            <h2 className="dod-heading">Your delivery</h2>

            <ul className="dod-list">
            {visibleOrders.map(order => {
                const verified = order.delivery_partner_verification === "Verified";
                const mine = managingOrder === order._id;
                const items = Array.isArray(order.items) ? order.items : [];
                const total = items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0);
                const km = getDistance(
                    clat,
                    clong,
                    order?.shopcorrdinates?.latitude,
                    order?.shopcorrdinates?.longitude
                )?.toFixed(1);

                return (
                <li key={order._id} className="card dod-card">
                    <div className="dod-top">
                        <div className="dod-id-block">
                            <h3 className="dod-order-title">Order {String(order._id).slice(-6).toUpperCase()}</h3>
                            <p className="dod-order-id">ID {order._id}</p>
                        </div>
                        <span className={verified ? 'pill pill-ok' : 'pill pill-warn'}>
                            {verified ? 'Picked up' : 'Waiting for pickup'}
                        </span>
                    </div>

                    <dl className="dod-facts">
                        <div className="dod-fact">
                            <dt>Distance to shop</dt>
                            <dd>{km} km</dd>
                        </div>
                        {order.customername && (
                            <div className="dod-fact">
                                <dt>Customer</dt>
                                <dd>{order.customername}</dd>
                            </div>
                        )}
                        {mine && verified && order.address && (
                            <div className="dod-fact dod-fact-wide">
                                <dt>Deliver to</dt>
                                <dd>{[order.address, order.district, order.pincode].filter(Boolean).join(', ')}</dd>
                            </div>
                        )}
                        {order.payment_method && (
                            <div className="dod-fact">
                                <dt>Payment</dt>
                                <dd>{order.payment_method}</dd>
                            </div>
                        )}
                        {items.length > 0 && (
                            <div className="dod-fact">
                                <dt>Order total</dt>
                                <dd>{rupees(total)}</dd>
                            </div>
                        )}
                    </dl>

                    {items.length > 0 && (
                        <ul className="dod-items" aria-label="Items in this order">
                            {items.map((it, i) => (
                                <li key={`${it.productid}-${i}`}>{it.quantity} × {it.productname}</li>
                            ))}
                        </ul>
                    )}

                    {mine && !verified && (
                        <p className="dod-help">Go to the shop and show the QR code so the seller can confirm pickup.</p>
                    )}
                    {mine && verified && (
                        <p className="dod-help">Take the order to the customer, then scan the QR code in their app to finish.</p>
                    )}

                    <div className="dod-actions">
                        {mine && verified && (
                            <a className="btn btn-secondary btn-block dod-big" href={`tel:${order.phoneNo}`}>
                                Call customer {order.phoneNo}
                            </a>
                        )}
                        {mine && !verified && (
                            <button type="button" className="btn btn-primary btn-block dod-big" onClick={() => { setQrVusibility(true), setSelectedOrder(order) }}>
                                Show QR to shop
                            </button>
                        )}
                        {mine && verified && (
                            <button
                                type="button"
                                className="btn btn-primary btn-block dod-big"
                                onClick={() => {
                                    setSelectedOrder(order);
                                    setShowScanner(true);
                                }}
                            >
                                Scan customer QR
                            </button>
                        )}
                    </div>
                </li>
                );
            })}
            </ul>

            {showScanner && selectedOrder && (
                <div className="dod-backdrop">
                    <div
                        className="dod-dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="dod-scan-title"
                        onKeyDown={(e) => { if (e.key === 'Escape') setShowScanner(false); }}
                    >
                        <h2 id="dod-scan-title" className="dod-dialog-title">Scan the customer's QR code</h2>
                        <p className="dod-dialog-text">The customer can open it from their order in the app.</p>
                        <QrScanner onScan={handleScan} />
                        <button
                            type="button"
                            className="btn btn-secondary btn-block dod-big"
                            autoFocus
                            onClick={() => {
                                setShowScanner(false);
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default DeliveryOrderDetail;
