import React, { useState } from 'react'
import axios from 'axios'
import './uploadproduct.css'
import { useNavigate } from 'react-router-dom';

const uploadproduct = () => {
    const navigate = useNavigate();
    const [file, setfile] = useState('')
    const [productname, setproductname] = useState('')
    const [productcategory, setproductcategory] = useState('')
    const [productcolor, setproductcolor] = useState('')
    const [productprice, setproductprice] = useState('')
    const [productextrainfo, setproductextrainfo] = useState('')
    const [preview, setPreview] = useState("");

    const token = localStorage.getItem("token");

    const handlesumit = async (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append("image", file); // image file
        formData.append("productname", productname);
        formData.append("productcategory", productcategory);
        formData.append("productcolor", productcolor);
        formData.append("productprice", productprice);
        formData.append("productextrainfo", productextrainfo);
        await axios.post("http://localhost:3000/add-product", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        navigate(-1);
    }




    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setfile(file);
        if (file) {
            setPreview(URL.createObjectURL(file)); // preview URL
        }
    };

    return (
        <div id='mainboxuploadproduct'>
            <img id='imgmainboxuploadproduct' src={preview === '' ? '/src/assets/react.svg' : preview} alt="preview" />
            <form id='formmainboxuploadproduct' onSubmit={handlesumit}>
                <input id='fileinput' type="file" onChange={handleFileChange} />
                <input type="text" onChange={(e) => { setproductname(e.target.value) }} placeholder='Product name' />
                <input type="text" onChange={(e) => { setproductcategory(e.target.value) }} placeholder='Product category' />
                <input type="text" onChange={(e) => { setproductcolor(e.target.value) }} placeholder='Product color' />
                <input type="number" onChange={(e) => { setproductprice(e.target.value) }} placeholder='Product price' />
                <input type="text" onChange={(e) => { setproductextrainfo(e.target.value) }} placeholder='Product extrainfo' />
                <button type='submit'>procedd</button>
            </form>
        </div>
    )
}

export default uploadproduct