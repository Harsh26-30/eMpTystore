import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import Loaderpage from "./Loaderpage"
import "./DeliveryPartnerdashboard.css"
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import axios from "axios";

const DeliveryPartnerdashboard = () => {
    const [clat, setclat] = useState(null)
    const [clong, setclong] = useState(null)
    const [orders, setrorders] = useState([])
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/deliveryorder`,

                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setrorders(res.data.orders)
            } catch (err) {
                console.error(err);
            }
        };

        fetchOrders();
    }, [token])


    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setclat(position.coords.latitude)
                setclong(position.coords.longitude)
            },
            (error) => console.log(error.message)
        )
    }, [])

    // const position = [clat, clong]

    const INDIA_BOUNDS = {
        minLat: 6.5,
        maxLat: 37.5,
        minLng: 68.0,
        maxLng: 97.5,
    }

    if (!clat || !clong) {
        return <Loaderpage />
    }

    // const destination = [28.7041, 77.1025]; // Delhi example

    function Routing({ start, end }) {
        const map = useMapEvents({});

        useEffect(() => {
            if (!map || !L.Routing) return;

            const routingControl = L.Routing.control({
                waypoints: [
                    L.latLng(start[0], start[1]),
                    L.latLng(end[0], end[1]),
                ],
                routeWhileDragging: false,
                addWaypoints: false,
                draggableWaypoints: false,
                fitSelectedRoutes: true,
                show: false,
            }).addTo(map);

            return () => {
                map.removeControl(routingControl);
            };
        }, [map, start, end]);

        return null;
    }

    // ✅ correct zoom tracker
    // function ZoomTracker() {
    //     useMapEvents({
    //         zoomend: (e) => {
    //             // setZoom(e.target.getZoom())
    //         },
    //     })
    //     return null
    // }

    // const handleClick = async (e) => {
    //     try {
    //         const res = await axios.post(
    //             `${import.meta.env.VITE_API_URL}/aceptdelivery`, {

    //         },
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             }
    //         );
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    return (
        <div id='maindpd'>
            {/* <MapContainer
                center={position}
                zoom={6}
                style={{ height: "500px", width: "100%" }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <Marker position={position}>
                    <Popup>Your Location</Popup>
                </Marker>

                <Routing start={position} end={destination} />
            </MapContainer> */}
            {
                Array.isArray(orders) && orders.length > 0 ? (
                    orders
                        .filter(order => order.orderstatus === 'RFD').map((order) => (
                            <div key={order._id} id='deliveryrequest'>
                                <div id='box1'>
                                    <h5>Order Id: {order._id}</h5>
                                    <h5>Seller Name: {order.sellerName}</h5>
                                    <h5>Address: {order.address}</h5>
                                    <h4>{order.distance} km</h4>
                                </div>

                                <div id='box2'>
                                    <button>
                                        Accept
                                    </button>
                                </div>
                            </div>
                        ))
                ) : (
                    <></>
                )
            }
        </div>
    )
}

export default DeliveryPartnerdashboard