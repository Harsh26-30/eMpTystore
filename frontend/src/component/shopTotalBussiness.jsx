import React, { useEffect, useState } from "react";
import axios from "axios";
import "./shopTotalBussiness.css";

const ShopTotalBussiness = () => {
    const token = localStorage.getItem("token");
    const [shopTotalBussiness, setShopTotalBussiness] = useState(0);

    const fun1 = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/checkuserinfo`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setShopTotalBussiness(res.data.shopTotalBussiness || 0);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {   
        fun1();
    }, [token]);

    return (
        <div id="mainboxshopTotalBussiness">
            <div id="shopTotalBussiness">
                <h3> Total Business</h3>
                <h3>₹ {shopTotalBussiness}</h3>
            </div>
        </div>

    );
};

export default ShopTotalBussiness;