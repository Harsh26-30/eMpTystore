import React from 'react'
import './productview.css'
import Header2 from './header2'
import { useLocation, useNavigate } from "react-router-dom";

const productview = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const product = location.state;

    console.log(product);
    return (
        <div id='mainboxproductview'>
            <Header2 />
            <img id='imgproductview' src={product.productimage} alt={product.productname} />
            <div id='box2productview'>
                <h4 id='h4productview'>Product Name:- {product.productname}</h4>
                <p>Product category:- {product.productcategory}</p>
                <p>Product Color:- {product.productcolor}</p>
                <p>Product Price: ₹{product.productprice}</p>
                <p>Extra Info:- {product.productextrainfo}</p>
            </div>
            <button id='btnproductview' onClick={(e)=>{navigate("/buynow",{ state: product});}}>Buy Now</button>
        </div>
    )
}

export default productview
