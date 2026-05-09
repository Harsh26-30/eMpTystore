import React from 'react';
import './searchresult.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const Searchresult = ({ shops }) => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const handleadd = async (e, id) => {
        e.stopPropagation(); // prevent navigation

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/buildconnection`,
                { connectionid: id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(res.data);

        } catch (err) {
            console.log("Search error:", err);
        }
    };

    return (
        <div id='bossbox'>
            {Array.isArray(shops) && shops.length > 0 ? (
                shops.map((shop) => (
                    <div
                        key={shop._id || shop.id}
                        id='mainboxsearchresult'
                        onClick={() => navigate(`/shop/${shop._id || shop.id}`)}
                    >
                        <div id='box2searchresult'>
                            <div id='h3searchresult'>
                                <h3>
                                    {shop?.ui?.generalinfo?.BusinessName || "No Name"}
                                </h3>

                                <p>by:- {shop?.email}</p>
                            </div>

                            <button onClick={(e) => handleadd(e, shop?.email)}>
                                Add
                            </button>

                        </div>
                    </div>
                ))
            ) : (
                <p>No shops found</p>
            )}
        </div>
    );
};

export default Searchresult;