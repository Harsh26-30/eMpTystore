import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './NearByShop.css'

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371

    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
}

// Returns km as a number, or null when either side has no usable location
function distanceKm(clat, clong, shop) {
    const nums = [clat, clong, shop.shoplatitude, shop.shoplongitude].map(Number)
    if (nums.some((n) => Number.isNaN(n)) || clat === '' || clong === '') return null
    return getDistance(nums[0], nums[1], nums[2], nums[3])
}

function formatDistance(km) {
    if (km === null) return ''
    if (km < 1) return `${Math.max(10, Math.round(km * 100) * 10)} m away`
    return `${km.toFixed(1)} km away`
}

const NearByShop = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const [shops, setShops] = useState([])
    const [clat, setclat] = useState('')
    const [clong, setclong] = useState('')
    const [status, setStatus] = useState('loading') // loading | ready | error
    const [notice, setNotice] = useState('')
    const noticeTimer = useRef(null)

    const fun1 = async () => {
        setStatus('loading')
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/allshops`,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            setShops(res.data.shops || [])
            setStatus('ready')

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setclat(position.coords.latitude)
                    setclong(position.coords.longitude)
                },
                (error) => {
                    console.log(error.message)
                }
            )
        } catch (err) {
            console.log(err)
            setStatus('error')
        }
    }

    useEffect(() => {
        fun1()
        return () => clearTimeout(noticeTimer.current)
    }, [token])

    const showNotice = (text) => {
        setNotice(text)
        clearTimeout(noticeTimer.current)
        noticeTimer.current = setTimeout(() => setNotice(''), 3500)
    }

    // Open shops first, then nearest first when we know where the customer is
    const rows = shops
        .map((shop) => ({ shop, km: distanceKm(clat, clong, shop) }))
        .sort((a, b) => {
            const aOpen = a.shop.shopOpenOrNot === 'Open' ? 0 : 1
            const bOpen = b.shop.shopOpenOrNot === 'Open' ? 0 : 1
            if (aOpen !== bOpen) return aOpen - bOpen
            if (a.km === null || b.km === null) return 0
            return a.km - b.km
        })

    if (status === 'loading') {
        return (
            <ul className="shops" aria-busy="true" aria-label="Loading shops">
                {[0, 1, 2, 3].map((i) => (
                    <li key={i} className="shop-skeleton" />
                ))}
            </ul>
        )
    }

    if (status === 'error') {
        return (
            <div className="shops-message" role="alert">
                <p>We could not load the shops. Check your internet connection and try again.</p>
                <button type="button" onClick={fun1}>Try again</button>
            </div>
        )
    }

    if (rows.length === 0) {
        return (
            <div className="shops-message">
                <p>No shops are listed yet.</p>
                <button type="button" onClick={fun1}>Refresh</button>
            </div>
        )
    }

    return (
        <>
            <ul className="shops">
                {rows.map(({ shop, km }) => {
                    const info = shop.ui?.generalinfo || {}
                    const isOpen = shop.shopOpenOrNot === 'Open'
                    const name = info.BusinessName || 'Unnamed shop'

                    return (
                        <li key={shop._id}>
                            <button
                                type="button"
                                className={isOpen ? 'shop' : 'shop is-closed'}
                                style={{
                                    backgroundColor: info.BackgroundColor || undefined,
                                    backgroundImage: info.Backgroundimage ? `url(${info.Backgroundimage})` : undefined,
                                    color: info.TextColor || undefined
                                }}
                                aria-disabled={!isOpen}
                                onClick={() => {
                                    if (isOpen) {
                                        navigate(`/Shopnox/${shop._id}`)
                                    } else {
                                        showNotice(`${name} is closed right now. Please check back later.`)
                                    }
                                }}
                            >
                                <span className="shop-name">{name}</span>
                                <span className="shop-meta">
                                    <span className={isOpen ? 'shop-pill is-open' : 'shop-pill'}>
                                        {isOpen ? 'Open' : 'Closed'}
                                    </span>
                                    {km !== null && <span className="shop-distance">{formatDistance(km)}</span>}
                                </span>
                            </button>
                        </li>
                    )
                })}
            </ul>

            {notice && <p className="shops-toast" role="status">{notice}</p>}
        </>
    )
}

export default NearByShop
