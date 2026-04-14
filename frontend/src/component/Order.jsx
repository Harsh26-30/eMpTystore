import React, { useEffect } from 'react'
import './Order.css'
import Header2 from "./header2";

const Order = () => {
  const token = localStorage.getItem("token");

  useEffect(async () => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/Orders`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }, [])

  return (
    <div id='mainboxOrder'>
      <div id='box1Order'>
        <h2>Order</h2>
        <div id='box22Order'>
          <button >
            Confirm Order
          </button>
          <button >
            Prepaired
          </button>
        </div>
      </div>
      <div id='box2Order'>
        {/* {Array.isArray(products) && products.length > 0 ? (
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
            )} */}
      </div>
    </div>
  )
}

export default Order
