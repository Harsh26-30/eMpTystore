import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './searchresult.css'

const Searchresult = ({ shops, searched = true }) => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const [added, setAdded] = useState({})
    const [failed, setFailed] = useState('')

    const handleadd = async (e, id) => {
        e.stopPropagation() // prevent navigation
        setFailed('')

        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/buildconnection`,
                { connectionid: id },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setAdded((prev) => ({ ...prev, [id]: true }))
        } catch (err) {
            console.log('Search error:', err)
            setFailed('We could not add this shop. Please try again.')
        }
    }

    const list = Array.isArray(shops) ? shops : []

    if (!searched) return null

    return (
        <div className="sr-wrap">
            {failed && <p className="alert alert-error" role="alert">{failed}</p>}

            {list.length > 0 ? (
                <ul className="sr-list">
                    {list.map((shop) => {
                        const shopId = shop._id || shop.id
                        const name = shop?.ui?.generalinfo?.BusinessName || 'Unnamed shop'

                        return (
                            <li key={shopId} className="card sr-item">
                                <button type="button" className="sr-open" onClick={() => navigate(`/Shopnox/${shopId}`)}>
                                    <span className="sr-name">{name}</span>
                                    {shop?.email && <span className="sr-email">{shop.email}</span>}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-small"
                                    onClick={(e) => handleadd(e, shop?.email)}
                                    disabled={added[shop?.email]}
                                >
                                    {added[shop?.email] ? 'Added' : 'Add'}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            ) : (
                <div className="empty-state">
                    <p>No shops found. Check the spelling or try a shorter name.</p>
                </div>
            )}
        </div>
    )
}

export default Searchresult
