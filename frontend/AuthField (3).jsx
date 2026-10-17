import React, { useCallback, useEffect, useRef, useState } from 'react'
import './Product.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const rupees = (n) => `₹${(Number(n) || 0).toLocaleString('en-IN')}`

const soldShare = (item) => {
    const sold = Number(item.unitsold) || 0
    const stock = Number(item.totalstock) || 0
    const all = sold + stock
    return all > 0 ? Math.round((sold / all) * 100) : 0
}

const Product = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [Products, setProducts] = useState([]);
    const [loadState, setLoadState] = useState('loading') // loading | ready | error
    const [openStockId, setOpenStockId] = useState(null);
    const [UpdateInputvalue, setUpdateInputvalue] = useState('');
    const [saving, setSaving] = useState(false)
    const [stockError, setStockError] = useState('')
    const [notice, setNotice] = useState(null)
    const noticeTimer = useRef(null)

    const showNotice = (text, tone = 'ok') => {
        setNotice({ text, tone })
        clearTimeout(noticeTimer.current)
        noticeTimer.current = setTimeout(() => setNotice(null), 4000)
    }

    const fetchProducts = useCallback(async () => {
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
            setLoadState('ready')
        } catch (err) {
            console.error(err);
            setLoadState((prev) => (prev === 'ready' ? 'ready' : 'error'))
        }
    }, [token])

    useEffect(() => {
        setLoadState('loading')
        fetchProducts();
        return () => clearTimeout(noticeTimer.current)
    }, [fetchProducts])

    const handleUpdatebox = (id) => {
        setOpenStockId(id);
        setUpdateInputvalue('');
        setStockError('');
    };

    const handleupdatestocks = async (id, name) => {
        setSaving(true)
        setStockError('')
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/update-stock`,
                {
                    UpdateInputvalue: UpdateInputvalue,
                    productid: id
                }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            setOpenStockId(null);
            showNotice(`Stock updated for ${name}.`)
            fetchProducts()
        } catch (err) {
            console.error(err)
            setStockError(err.response?.data?.message || 'We could not update the stock. Check your connection and try again.')
        }
        setSaving(false)
    }

    const list = Array.isArray(Products) ? Products : []

    return (
        <section className="sp" aria-labelledby="sp-heading">
            <div className="sp-top">
                <div>
                    <h2 id="sp-heading">Your products</h2>
                    {loadState === 'ready' && list.length > 0 && (
                        <p className="sp-sub">{list.length} {list.length === 1 ? 'product' : 'products'} in your shop</p>
                    )}
                </div>
                <button type="button" className="sp-btn sp-btn-primary" onClick={() => { navigate("/uploadproduct"); }}>
                    Add product
                </button>
            </div>

            {loadState === 'loading' && (
                <div className="sp-grid" aria-busy="true" aria-label="Loading products">
                    {[0, 1, 2].map((i) => <div key={i} className="sp-skel" />)}
                </div>
            )}

            {loadState === 'error' && (
                <div className="sp-message" role="alert">
                    <p>We could not load your products. Check your internet connection and try again.</p>
                    <button type="button" className="sp-btn sp-btn-secondary" onClick={() => { setLoadState('loading'); fetchProducts() }}>
                        Try again
                    </button>
                </div>
            )}

            {loadState === 'ready' && list.length === 0 && (
                <div className="sp-message">
                    <p>You have not added any products yet. Add your first product so customers can order from you.</p>
                    <button type="button" className="sp-btn sp-btn-primary" onClick={() => { navigate("/uploadproduct"); }}>
                        Add your first product
                    </button>
                </div>
            )}

            {loadState === 'ready' && list.length > 0 && (
                <ul className="sp-grid">
                    {list.map((item) => {
                        const stock = Number(item.totalstock) || 0
                        const share = soldShare(item)
                        const stockPill = stock <= 0
                            ? { label: 'Out of stock', cls: 'is-out' }
                            : stock <= 5
                                ? { label: 'Low stock', cls: 'is-low' }
                                : { label: 'In stock', cls: 'is-ok' }
                        const isOpen = openStockId === item._id
                        return (
                            <li key={item._id} className="sp-card">
                                <div className="sp-main">
                                    <div className="sp-img">
                                        {item.productimage
                                            ? <img src={item.productimage} alt={item.productname} />
                                            : <span>No photo</span>}
                                    </div>
                                    <div className="sp-info">
                                        <h3>{item.productname}</h3>
                                        <p className="sp-price">{rupees(item.productprice)}</p>
                                        <div className="sp-stock-line">
                                            <span className={`sp-pill ${stockPill.cls}`}>{stockPill.label}</span>
                                            <span className="sp-units">{stock} {stock === 1 ? 'unit' : 'units'} left</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="sp-sold">
                                    <div className="sp-sold-text">
                                        <span>{Number(item.unitsold) || 0} sold</span>
                                        <span>{share}% of all units</span>
                                    </div>
                                    <div className="sp-bar" role="progressbar" aria-label={`${item.productname} sold`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={share}>
                                        <div className="sp-bar-fill" style={{ width: `${share}%` }} />
                                    </div>
                                </div>

                                {!isOpen && (
                                    <button type="button" className="sp-btn sp-btn-secondary" onClick={() => { handleUpdatebox(item._id) }}>
                                        Add stock
                                    </button>
                                )}

                                {isOpen && (
                                    <form
                                        className="sp-stock-form"
                                        onSubmit={(e) => { e.preventDefault(); handleupdatestocks(item._id, item.productname) }}
                                    >
                                        <label htmlFor={`sp-stock-${item._id}`}>Units to add</label>
                                        <input
                                            id={`sp-stock-${item._id}`}
                                            type="number"
                                            inputMode="numeric"
                                            step="1"
                                            required
                                            autoFocus
                                            value={UpdateInputvalue}
                                            onChange={(e) => { setUpdateInputvalue(e.target.value) }}
                                            aria-describedby={`sp-stock-hint-${item._id}`}
                                        />
                                        <span id={`sp-stock-hint-${item._id}`} className="sp-hint">
                                            This number is added to your current stock of {stock}.
                                        </span>
                                        {stockError && <p className="sp-error" role="alert">{stockError}</p>}
                                        <div className="sp-form-actions">
                                            <button type="button" className="sp-btn sp-btn-secondary" onClick={() => setOpenStockId(null)} disabled={saving}>
                                                Cancel
                                            </button>
                                            <button type="submit" className="sp-btn sp-btn-primary" disabled={saving}>
                                                {saving ? 'Saving…' : 'Save stock'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </li>
                        )
                    })}
                </ul>
            )}

            <div className="sp-toast-wrap" role="status" aria-live="polite">
                {notice && <div className={`sp-toast is-${notice.tone}`}>{notice.text}</div>}
            </div>
        </section>
    )
}

export default Product
