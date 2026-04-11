import React from 'react'
import './searchresult.css'
import { useNavigate } from 'react-router-dom';

const searchresult = ({ products }) => {
        const navigate = useNavigate();

    return (
        <div id='bossbox'>
            {Array.isArray(products) && products.length > 0 ? (
                products.map((product) => (
                    <div key={product._id} id='mainboxsearchresult' onClick={(e)=>{navigate("/productview",{ state: product });}}>
                        <div id='box2searchresult'>
                            <img id='imgsearchresult' src={product.productimage} alt={product.productname} />
                            <div id='h3searchresult'>
                                <h3>Product_Nmae:{product.productname}</h3>
                                <h3>Product_Price:₹{product.productprice}</h3>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>No products found</p>
            )}
        </div>
    )
}

export default searchresult