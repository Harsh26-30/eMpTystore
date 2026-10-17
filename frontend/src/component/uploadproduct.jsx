import React, { useEffect, useState } from 'react'
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
    const [productstock, setproductstock] = useState('')
    const [preview, setPreview] = useState("");
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    const token = localStorage.getItem("token");

    // Free the temporary preview URL when it changes or the page closes
    useEffect(() => {
        return () => { if (preview) URL.revokeObjectURL(preview) }
    }, [preview])

    const handlesumit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setError('')
        const formData = new FormData();
        formData.append("image", file); // image file
        formData.append("productname", productname);
        formData.append("productcategory", productcategory);
        formData.append("productcolor", productcolor);
        formData.append("productprice", productprice);
        formData.append("productextrainfo", productextrainfo);
        formData.append("productstock", productstock);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/add-product`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.error || err.response?.data?.message || 'We could not add this product. Check your connection and try again.')
            setSubmitting(false)
            return
        }

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
        <div className="page">
            <main className="page-body is-narrow">
                <button type="button" className="back-link" onClick={() => navigate(-1)}>Back to your products</button>
                <h1 className="page-title">Add a product</h1>
                <p className="page-lead">Customers will see these details in your shop.</p>

                <form className="card su-form" onSubmit={handlesumit}>
                    <div className="su-photo">
                        {preview
                            ? <img src={preview} alt="Preview of the chosen product photo" />
                            : <span>No photo chosen yet</span>}
                    </div>

                    <div className="field">
                        <label className="label" htmlFor="su-photo-input">Product photo</label>
                        <input required id="su-photo-input" className="input su-file" type="file" accept="image/*" onChange={handleFileChange} />
                    </div>

                    <div className="field">
                        <label className="label" htmlFor="su-name">Product name</label>
                        <input required id="su-name" className="input" type="text" autoComplete="off" value={productname} onChange={(e) => { setproductname(e.target.value) }} />
                    </div>

                    <div className="su-pair">
                        <div className="field">
                            <label className="label" htmlFor="su-category">Category</label>
                            <input required id="su-category" className="input" type="text" autoComplete="off" value={productcategory} onChange={(e) => { setproductcategory(e.target.value) }} />
                        </div>
                        <div className="field">
                            <label className="label" htmlFor="su-color">Colour</label>
                            <input required id="su-color" className="input" type="text" autoComplete="off" value={productcolor} onChange={(e) => { setproductcolor(e.target.value) }} />
                        </div>
                    </div>

                    <div className="su-pair">
                        <div className="field">
                            <label className="label" htmlFor="su-price">Price (₹)</label>
                            <input required id="su-price" className="input" type="number" inputMode="decimal" min="0" value={productprice} onChange={(e) => { setproductprice(e.target.value) }} />
                        </div>
                        <div className="field">
                            <label className="label" htmlFor="su-stock">Units in stock</label>
                            <input required id="su-stock" className="input" type="number" inputMode="numeric" min="0" step="1" value={productstock} onChange={(e) => { setproductstock(e.target.value) }} />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label" htmlFor="su-info">Extra details</label>
                        <input required id="su-info" className="input" type="text" autoComplete="off" aria-describedby="su-info-hint" value={productextrainfo} onChange={(e) => { setproductextrainfo(e.target.value) }} />
                        <span id="su-info-hint" className="hint">For example size, weight or brand.</span>
                    </div>

                    {error && <p className="alert alert-error" role="alert">{error}</p>}

                    <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                        {submitting ? 'Adding product…' : 'Add product'}
                    </button>
                </form>
            </main>
        </div>
    )
}

export default uploadproduct
