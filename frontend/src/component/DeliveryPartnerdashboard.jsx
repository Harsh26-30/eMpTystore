import React, { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import Loaderpage from "./Loaderpage"
import "./DeliveryPartnerdashboard.css"
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-rotatedmarker";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import axios from "axios";
import OrderQr from "./OrderQr"
import QrScanner from "./QrScanner";
import Deliveryorderdetail from "./deliveryorderdetail"

const Routing = ({ start, end, routingRef }) => {
    const map = useMapEvents({});

    useEffect(() => {
        if (!map || !start || !end) return;

        if (!routingRef.current) {
            routingRef.current = L.Routing.control({
                waypoints: [
                    L.latLng(start[0], start[1]),
                    L.latLng(end[0], end[1]),
                ],
                routeWhileDragging: false,
                addWaypoints: false,
                draggableWaypoints: false,
                fitSelectedRoutes: true,
                show: false,
                createMarker: () => null,
            }).addTo(map);
        } else {
            routingRef.current.setWaypoints([
                L.latLng(start[0], start[1]),
                L.latLng(end[0], end[1]),
            ]);
        }

        return () => { };
    }, [map, start[0], start[1], end[0], end[1]]);

    return null;
};



const DeliveryPartnerdashboard = () => {
    const [clat, setclat] = useState(null)
    const [clong, setclong] = useState(null)
    const [destlat, setdestlat] = useState(null)
    const [destlong, setdestlong] = useState(null)
    const [mapvisblity, setmapvisblity] = useState(false)
    const token = localStorage.getItem("token");
    const [heading, setHeading] = useState(0);
    const prevPos = useRef(null);
    const markerRef = useRef(null);
    const [QrVusibility, setQrVusibility] = useState(false);
    const [managingOrder, setmanagingOrder] = useState('')
    const [selectedOrder, setSelectedOrder] = useState(null);
    const routingRef = useRef(null);   // <-- ADD THIS



    useEffect(() => {
        const fetchOrders = async () => {
            try {


                const res2 = await axios.get(
                    `${import.meta.env.VITE_API_URL}/checkuserinfo`,

                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setmanagingOrder(res2.data.managingOrder)
                setdestlat(res2.data.slat);
                setdestlong(res2.data.slong);


            } catch (err) {
                console.error(err);
            }
        };

        fetchOrders();
    }, [token])

    useEffect(() => {
        const marker = markerRef.current;

        if (marker && marker.setRotationAngle) {
            marker.setRotationAngle(heading);
        }
    }, [heading]);

    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            async (position) => {
                const newLat = position.coords.latitude;
                const newLng = position.coords.longitude;

                if (prevPos.current) {
                    const angle = getBearing(
                        prevPos.current.lat,
                        prevPos.current.lng,
                        newLat,
                        newLng
                    );
                    setHeading(angle);
                }


                await axios.post(
                    `${import.meta.env.VITE_API_URL}/Updatelatlog`,
                    {
                        clatitude: position.coords.latitude,
                        clongitude: position.coords.longitude
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                prevPos.current = {
                    lat: newLat,
                    lng: newLng,
                };

                setclat(newLat);
                setclong(newLng);
            },
            (error) => console.log(error.message),
            {
                enableHighAccuracy: true,
                maximumAge: 0,
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);


    const position =
        clat != null && clong != null
            ? [Number(clat), Number(clong)]
            : null;
    console.log('positiolatandlog', clat, clong);


    const INDIA_BOUNDS = {
        minLat: 6.5,
        maxLat: 37.5,
        minLng: 68.0,
        maxLng: 97.5,
    }

    if (clat === null || clong === null) {
        return <Loaderpage />
    }

    const destination = [destlat, destlong]; // Delhi example
    console.log('desttination', destlat, destlong);


    const riderIcon = L.icon({
        iconUrl: "/OIP.webp",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
    });

    const shopIcon = L.icon({
        iconUrl: "/ab8a01bebb0428f367b1525360046a3f.jpg",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
    });

    function getBearing(lat1, lon1, lat2, lon2) {
        const dLon = (lon2 - lon1) * Math.PI / 180;

        lat1 = lat1 * Math.PI / 180;
        lat2 = lat2 * Math.PI / 180;

        const y = Math.sin(dLon) * Math.cos(lat2);
        const x =
            Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

        let bearing = Math.atan2(y, x) * 180 / Math.PI;

        return (bearing + 360) % 360;
    }

    return (
        <div id='maindpd'>
            {(mapvisblity === true || managingOrder !== '' && managingOrder) && (
                <MapContainer
                    center={position}
                    zoom={6}
                    style={{ height: "500px", width: "100%" }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    <Marker
                        position={position}
                        icon={riderIcon}
                        ref={markerRef}
                    >
                        <Popup>Your Location</Popup>
                    </Marker>

                    {destlat && destlong && (
                        <Marker position={[destlat, destlong]} icon={shopIcon}>
                            <Popup>Shop Location</Popup>
                        </Marker>
                    )}

                    {destlat !== null && destlong !== null && (
                        <Routing
                            start={position}
                            end={destination}
                            routingRef={routingRef}
                        />)}            </MapContainer>)}

            <Deliveryorderdetail
                setQrVusibility={setQrVusibility}
                setSelectedOrder={setSelectedOrder}
                selectedOrder={selectedOrder}
                setmapvisblity={setmapvisblity}
            />
            {QrVusibility === true && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(0,0,0,0.6)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,   // 👈 highest layer
                    }}
                >
                    <div
                        style={{
                            background: "white",
                            padding: "20px",
                            borderRadius: "12px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {selectedOrder && <OrderQr value={selectedOrder._id} />}
                        <button
                            onClick={() => setQrVusibility(false)}
                            style={{ marginTop: "10px" }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DeliveryPartnerdashboard