import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import Header2 from './header2'
import AuthField from './AuthField'
import './Cart.css'
import './buynow.css'

const buynow = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const product = location.state

    const [address, setaddress] = useState('')
    const [country, setcountry] = useState('')
    const [state, setstate] = useState('')
    const [district, setdistrict] = useState('')
    const [pincode, setpincode] = useState('')
    const [quantity, setquantity] = useState(1)
    const [contact, setcontact] = useState('')
    const [message, setMessage] = useState(null) // { tone: 'ok' | 'error', text }
    const [busy, setBusy] = useState('')
    const token = localStorage.getItem('token')

    useEffect(() => {
        if (!token) return

        const fun1 = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/checkuserinfo`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                setaddress(res.data.address || '')
                setcountry(res.data.country || '')
                setstate(res.data.state || '')
                setdistrict(res.data.district || '')
                setpincode(res.data.pincode || '')
                setcontact(res.data.phoneNo || '')
            } catch (err) {
                console.log('Error:', err)
            }
        }
        setquantity(1)
        fun1()
    }, [token])

    const increase = () => setquantity((prev) => prev + 1)
    const decrease = () => setquantity((prev) => (prev > 1 ? prev - 1 : 1))

    const send = async (key, request, okText, failText) => {
        setMessage(null)
        setBusy(key)
        try {
            await request()
            setMessage({ tone: 'ok', text: okText })
        } catch (err) {
            console.log(err)
            setMessage({ tone: 'error', text: failText })
        } finally {
            setBusy('')
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        send(
            'address',
            () => axios.post(`${import.meta.env.VITE_API_URL}/updateaddress`, {
                address, country, state, district, pincode
            }, { headers: { Authorization: `Bearer ${token}` } }),
            'Delivery address saved.',
            'We could not save your address. Please try again.'
        )
    }

    const handlecontactSubmit = (e) => {
        e.preventDefault()
        send(
            'contact',
            () => axios.post(`${import.meta.env.VITE_API_URL}/updatecontact`, {
                phoneNo: contact
            }, { headers: { Authorization: `Bearer ${token}` } }),
            'Contact number saved.',
            'We could not save your number. Please try again.'
        )
    }

    const handleorder = (e) => {
        e.preventDefault()
        send(
            'order',
            () => axios.post(`${import.meta.env.VITE_API_URL}/placeOrder`, {
                quantity, productid: product?._id, productname: product?.productname, sellerid: product?.productsellerid
            }, { headers: { Authorization: `Bearer ${token}` } }),
            'Order placed.',
            'We could not place your order. Please try again.'
        )
    }

    return (
        <div className="page">
            <Header2 />
            <main className="page-body is-narrow">
                <button type="button" className="back-link" onClick={() => navigate(-1)}>&lsaquo; Back</button>
                <h1 className="page-title">Check your order</h1>
                {product?.productname && (
                    <p className="page-lead">{product.productname}{product.productprice ? ` · ₹${product.productprice}` : ''}</p>
                )}

                <section className="card bn-card" aria-labelledby="bn-address-title">
                    <h2 id="bn-address-title" className="section-title">Delivery address</h2>
                    <form className="bn-form" onSubmit={handleSubmit}>
                        <AuthField label="Address" name="address" autoComplete="street-address" value={address} onChange={(e) => setaddress(e.target.value)} />
                        <div className="field">
                            <label className="label" htmlFor="bn-country">Country</label>
                            <select id="bn-country" className="input" value={country} onChange={(e) => setcountry(e.target.value)}>
                                <option value="">Select country</option>
                                <option value="India">India</option>
                                {country && country !== 'India' && <option value={country}>{country}</option>}
                            </select>
                        </div>
                        <AuthField label="State" name="state" autoComplete="address-level1" value={state} onChange={(e) => setstate(e.target.value)} />
                        <AuthField label="District" name="district" autoComplete="address-level2" value={district} onChange={(e) => setdistrict(e.target.value)} />
                        <AuthField label="PIN code" name="pincode" autoComplete="postal-code" inputMode="numeric" value={pincode} onChange={(e) => setpincode(e.target.value)} />
                        <button type="submit" className="btn btn-secondary" disabled={busy === 'address'}>
                            {busy === 'address' ? 'Saving…' : 'Save address'}
                        </button>
                    </form>
                </section>

                <section className="card bn-card" aria-labelledby="bn-contact-title">
                    <h2 id="bn-contact-title" className="section-title">Contact number</h2>
                    <form className="bn-form" onSubmit={handlecontactSubmit}>
                        <AuthField label="Mobile number" type="tel" name="phone" autoComplete="tel" inputMode="numeric" value={contact} onChange={(e) => setcontact(e.target.value)} />
                        <button type="submit" className="btn btn-secondary" disabled={busy === 'contact'}>
                            {busy === 'contact' ? 'Saving…' : 'Save number'}
                        </button>
                    </form>
                </section>

                <section className="card bn-card bn-qty" aria-labelledby="bn-qty-title">
                    <h2 id="bn-qty-title" className="section-title">Quantity</h2>
                    <div className="cart-stepper" role="group" aria-label="Quantity">
                        <button type="button" onClick={decrease} aria-label="Remove one">&minus;</button>
                        <span className="cart-qty" aria-live="polite">{quantity}</span>
                        <button type="button" onClick={increase} aria-label="Add one">+</button>
                    </div>
                </section>

                {message && (
                    <p className={`alert ${message.tone === 'ok' ? 'alert-ok' : 'alert-error'} bn-gap`} role={message.tone === 'ok' ? 'status' : 'alert'}>
                        {message.text}
                    </p>
                )}

                <button type="button" className="btn btn-primary btn-block bn-gap bn-order" onClick={handleorder} disabled={busy === 'order'}>
                    {busy === 'order' ? 'Placing order…' : 'Place order'}
                </button>
            </main>
        </div>
    )
}

export default buynow
