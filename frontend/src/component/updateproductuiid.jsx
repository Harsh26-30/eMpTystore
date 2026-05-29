import React, { useEffect, useState } from 'react'
import './updateproductuiid.css'
import axios from 'axios';

const Updateproductuiid = ({ setvisibilityval, onclicksave }) => {
    const token = localStorage.getItem("token");
    const [businessname, setbusinessname] = useState('');

    const [Product1, setProduct1] = useState('');
    const [Product2, setProduct2] = useState('');
    const [Product3, setProduct3] = useState('');
    const [Product4, setProduct4] = useState('');
    const [Product5, setProduct5] = useState('');
    const [Product6, setProduct6] = useState('');
    const [Product7, setProduct7] = useState('');
    const [Product8, setProduct8] = useState('');
    const [Product9, setProduct9] = useState('');
    const [Product10, setProduct10] = useState('');
    const [Product11, setProduct11] = useState('');
    const [Product12, setProduct12] = useState('');
    const [products, setProducts] = useState([]);
    const [TextColor, setTextColor] = useState();
    const [BackgroundColor, setBackgroundColor] = useState();
    const [backgroundimage, setbackgroundimage] = useState();

    const [inputvisibility, setinputvisibility] = useState('generalinfo');


    useEffect(() => {
        const fun1 = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/get-user-products`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setProducts(res.data); // ✅ store full array
            } catch (err) {
                console.log(err);
            }
        };

        fun1();
    }, [])




    const handlesaveproduct = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                Product1,
                Product2,
                Product3,
                Product4,
                Product5,
                Product6,
                Product7,
                Product8,
                Product9,
                Product10,
                Product11,
                Product12,
            };

            // ✅ remove empty / null / undefined
            const filteredPayload = Object.fromEntries(
                Object.entries(payload).filter(
                    ([_, value]) => value !== '' && value !== null && value !== undefined
                )
            );

            console.log("Sending:", filteredPayload);

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/updateproducttoui`,
                {
                    ...filteredPayload,
                    businessname,
                    TextColor,
                    BackgroundColor,
                    backgroundimage
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setvisibilityval(false);
            onclicksave();
            alert(res.data.msg);
        } catch (err) {
            console.log(err);
        }
    };

    return (

        <div id='addproducttoui'>
            <h2>Add Info</h2>
            <div id='headeraddproducttoui'>
                <button onClick={() => { setinputvisibility('generalinfo') }}>General Info</button>
                <button onClick={() => { setinputvisibility('productinfo') }}>Product Info</button>
            </div>
            <div id='box2addproducttoui'>
                <form>
                    <fieldset style={{ display: inputvisibility === 'generalinfo' ? 'initial' : 'none' }}>
                        <legend>Background Color</legend>
                        <select onChange={(e) => { setBackgroundColor(e.target.value) }}>
                            <option style={{ backgroundColor: 'lightgray' }} value="">Select Color</option>
                            <option style={{ backgroundColor: 'white' }} value="white">White</option>
                            <option style={{ backgroundColor: 'black' }} value="black">Black</option>
                            <option style={{ backgroundColor: 'red' }} value="red">Red</option>
                            <option style={{ backgroundColor: 'blue' }} value="blue">Blue</option>
                            <option style={{ backgroundColor: 'yellow' }} value="yellow">Yellow</option>
                            <option style={{ backgroundColor: 'green' }} value="green">Green</option>
                            <option style={{ backgroundColor: 'purple' }} value="purple">Purple</option>
                            <option style={{ backgroundColor: 'orange' }} value="orange">Orange</option>

                        </select>
                    </fieldset>
                    <fieldset style={{ display: inputvisibility === 'generalinfo' ? 'initial' : 'none' }}>
                        <legend>Text Color</legend>

                        <select onChange={(e) => { setTextColor(e.target.value) }}>
                            <option style={{ backgroundColor: 'lightgray' }} value="">Select Color</option>
                            <option style={{ backgroundColor: 'white' }} value="white">White</option>
                            <option style={{ backgroundColor: 'black' }} value="black">Black</option>
                            <option style={{ backgroundColor: 'red' }} value="red">Red</option>
                            <option style={{ backgroundColor: 'blue' }} value="blue">Blue</option>
                            <option style={{ backgroundColor: 'yellow' }} value="yellow">Yellow</option>
                            <option style={{ backgroundColor: 'green' }} value="green">Green</option>
                            <option style={{ backgroundColor: 'purple' }} value="purple">Purple</option>
                            <option style={{ backgroundColor: 'orange' }} value="orange">Orange</option>

                        </select>
                    </fieldset>
                    <fieldset style={{ display: inputvisibility === 'generalinfo' ? 'initial' : 'none' }}>
                        <legend>Bussiness Name</legend>
                        <input type="text" onChange={(e) => { setbusinessname(e.target.value) }} />
                    </fieldset>
                    <fieldset style={{ display: inputvisibility === 'generalinfo' ? 'initial' : 'none' }}>
                        <legend>Background Image</legend>
                        <input
                            type="file"
                            onChange={(e) => setbackgroundimage(e.target.files[0])}
                        />                    </fieldset>

                    <fieldset style={{ display: inputvisibility === 'productinfo' ? 'initial' : 'none' }}>
                        <legend>Product 1</legend>
                        <select value={Product1} onChange={(e) => setProduct1(e.target.value)}>
                            <option value="">Select Product</option>
                            {products.map((product) => (
                                <option value={product._id} key={product._id}>
                                    {product.productname}
                                </option>
                            ))}
                        </select>

                    </fieldset>

                    <fieldset style={{ display: inputvisibility === 'productinfo' ? 'initial' : 'none' }}>
                        <legend>Product 2</legend>
                        <select value={Product2} onChange={(e) => setProduct2(e.target.value)}>
                            <option value="">Select Product</option>
                            {products.map((product) => (
                                <option value={product._id} key={product._id}>
                                    {product.productname}
                                </option>
                            ))}
                        </select>
                    </fieldset>
                    <fieldset style={{ display: inputvisibility === 'productinfo' ? 'initial' : 'none' }}>
                        <legend>Product 3</legend>
                        <select value={Product3} onChange={(e) => setProduct3(e.target.value)}>
                            <option value="">Select Product</option>
                            {products.map((product) => (
                                <option value={product._id} key={product._id}>
                                    {product.productname}
                                </option>
                            ))}
                        </select>
                    </fieldset>
                    <fieldset style={{ display: inputvisibility === 'productinfo' ? 'initial' : 'none' }}>
                        <legend>Product 4</legend>
                        <select value={Product4} onChange={(e) => setProduct4(e.target.value)}>
                            <option value="">Select Product</option>
                            {products.map((product) => (
                                <option value={product._id} key={product._id}>
                                    {product.productname}
                                </option>
                            ))}
                        </select>
                    </fieldset>
                    <fieldset style={{ display: inputvisibility === 'productinfo' ? 'initial' : 'none' }}>
                        <legend>Product 5</legend>
                        <select value={Product5} onChange={(e) => setProduct5(e.target.value)}>
                            <option value="">Select Product</option>
                            {products.map((product) => (
                                <option value={product._id} key={product._id}>
                                    {product.productname}
                                </option>
                            ))}
                        </select>
                    </fieldset>
                    <fieldset style={{ display: inputvisibility === 'productinfo' ? 'initial' : 'none' }}>
                        <legend>Product 6</legend>
                        <select value={Product6} onChange={(e) => setProduct6(e.target.value)}>
                            <option value="">Select Product</option>
                            {products.map((product) => (
                                <option value={product._id} key={product._id}>
                                    {product.productname}
                                </option>
                            ))}
                        </select>
                    </fieldset>
                    <fieldset style={{ display: inputvisibility === 'productinfo' ? 'initial' : 'none' }}>
                        <legend>Product 7</legend>
                        <select value={Product7} onChange={(e) => setProduct7(e.target.value)}>
                            <option value="">Select Product</option>
                            {products.map((product) => (
                                <option value={product._id} key={product._id}>
                                    {product.productname}
                                </option>
                            ))}
                        </select>
                    </fieldset>
                    <fieldset style={{ display: inputvisibility === 'productinfo' ? 'initial' : 'none' }}>
                        <legend>Product 8</legend>
                        <select value={Product8} onChange={(e) => setProduct8(e.target.value)}>
                            <option value="">Select Product</option>
                            {products.map((product) => (
                                <option value={product._id} key={product._id}>
                                    {product.productname}
                                </option>
                            ))}
                        </select>
                    </fieldset>
                    <fieldset style={{ display: inputvisibility === 'productinfo' ? 'initial' : 'none' }}>
                        <legend>Product 9</legend>
                        <select value={Product9} onChange={(e) => setProduct9(e.target.value)}>
                            <option value="">Select Product</option>
                            {products.map((product) => (
                                <option value={product._id} key={product._id}>
                                    {product.productname}
                                </option>
                            ))}
                        </select>
                    </fieldset>
                    <fieldset style={{ display: inputvisibility === 'productinfo' ? 'initial' : 'none' }}>
                        <legend>Product 10</legend>
                        <select value={Product10} onChange={(e) => setProduct10(e.target.value)}>
                            <option value="">Select Product</option>
                            {products.map((product) => (
                                <option value={product._id} key={product._id}>
                                    {product.productname}
                                </option>
                            ))}
                        </select>
                    </fieldset>
                    <fieldset style={{ display: inputvisibility === 'productinfo' ? 'initial' : 'none' }}>
                        <legend>Product 11</legend>
                        <select value={Product12} onChange={(e) => setProduct11(e.target.value)}>
                            <option value="">Select Product</option>
                            {products.map((product) => (
                                <option value={product._id} key={product._id}>
                                    {product.productname}
                                </option>
                            ))}
                        </select>
                    </fieldset>
                    <fieldset style={{ display: inputvisibility === 'productinfo' ? 'initial' : 'none' }}>
                        <legend>Product 12</legend>
                        <select value={Product12} onChange={(e) => setProduct12(e.target.value)}>
                            <option value="">Select Product</option>
                            {products.map((product) => (
                                <option value={product._id} key={product._id}>
                                    {product.productname}
                                </option>
                            ))}
                        </select>
                    </fieldset>
                </form>
            </div>
            <button onClick={handlesaveproduct}>Save</button>
        </div>

    )
}

export default Updateproductuiid