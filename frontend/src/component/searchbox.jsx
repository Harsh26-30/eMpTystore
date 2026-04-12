import React, { useState } from "react";
import "./searchbox.css";
import Header2 from "./header2";
import axios from "axios";
import Searchresult from "./searchresult";

const SearchBox = () => {
    const [userinput, setUserInput] = useState("");
    const [products, setProducts] = useState([]);

    const token = localStorage.getItem("token");

    const handleClickSearch = async (e) => {
        e.preventDefault();
        if (!userinput) return;

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/search`,
                { userinput },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setProducts(res.data); // <-- FIXED here
        } catch (err) {
            console.log("Search error:", err);
        }
    };

    

    return (
        <div id="mainboxsearch">
            <Header2 />
            <div id="box2">
                <input
                    type="text"
                    placeholder="Search product..."
                    value={userinput}
                    onChange={(e) => setUserInput(e.target.value)}
                />
                <button id="buttonsearch" onClick={handleClickSearch}>
                    <img src="\search_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.png" alt="search" />
                </button>
            </div>
{/* 

            {Array.isArray(products) && products.length > 0 ? (
                products.map((product) => (
                    <div key={product._id}>
                        <img
                            src={product.productimage}
                            alt={product.productname}
                            width={100}
                        />
                        <h3>{product.productname}</h3>
                        <p>Category: {product.productcategory}</p>
                        <p>Price: {product.productprice}</p>
                    </div>
                ))
            ) : (
                <p>No products found</p>
            )} */}

            <Searchresult products={products}/>
        </div>
    );
};

export default SearchBox;