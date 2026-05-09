import React, { useState } from 'react'
import './Product.css'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

const Product = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [Products, setProducts] = useState([]);
    const [vUpdatebox, setvUpdatebox] = useState('');
    const [vidUpdatebox, setvidUpdatebox] = useState('false');
    const[UpdateInputvalue,setUpdateInputvalue] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/get-user-products`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setProducts(res.data)
            } catch (err) {
                console.error(err);
            }
        };

        fetchOrders();


    }, [token])

    const handleUpdatebox = (id) => {
        setvUpdatebox("true");
        setvidUpdatebox(id);
    };


    const handleupdatestocks = async (id) => {
        await axios.post(`${import.meta.env.VITE_API_URL}/update-stock`, 
            {UpdateInputvalue:UpdateInputvalue,
                productid:id
            }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

                setvUpdatebox("false");
    }


    return (
        <div id='mainboxProduct'>
            <button id='addproduct' onClick={(e) => { navigate("/uploadproduct"); }}> Add</button>
            {Products && Products.map((item, index) => (

                <div key={index} id='box2Product'>
                    <div></div>
                    <div id='imgbox'>
                        <img src={item.productimage} alt="" />
                    </div>
                    <div id='detailbox'>
                        <p style={{ fontSize: "20px", textTransform: "capitalize" }}>{item.productname} <br />
                            Stock:-{item.totalstock} <br />
                        </p>
                        <div style={{ width: "100%", background: "#dcdbdb", height: "20px", borderRadius: '10px', display: "flex" }}>
                            <div
                                style={{
                                    width: `${(item.unitsold / (item.totalstock + item.unitsold)) * 100}%`,
                                    background: (item.unitsold / (item.totalstock + item.unitsold)) * 100 >= 80 ? "green" : (Products.unitsold / Products.totalstock + Products.unitsold) * 100 >= 60 ? "Blue" : (Products.unitsold / Products.totalstock + Products.unitsold) * 100 >= 40 ? "Orange" : (Products.unitsold / Products.totalstock + Products.unitsold) * 100 >= 0 ? 'Red' : 'red',
                                    height: "100%",
                                    borderRadius: '10px'
                                }}
                            />
                            <p>{((item.unitsold / (item.totalstock + item.unitsold)) * 100).toFixed(0)}%</p>
                        </div>
                        < button onClick={() => { handleUpdatebox(item._id) }} id='updatestockbutton'>+</button>
                    </div>
                    {vUpdatebox === 'true' && vidUpdatebox === item._id && <div id='boxupdatestocks' >
                        <input type="Number" onChange={(e)=>{setUpdateInputvalue(e.target.value)}} />
                        <button onClick={()=>{handleupdatestocks(item._id)}}> Update Stocks</button>
                    </div>}
                </div>


            ))}
        </div>
    )
}

export default Product