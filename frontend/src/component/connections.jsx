import React, { useState, useEffect } from 'react'
import './connections.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Connections = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [closedMsg, setClosedMsg] = useState('');

  const fun1 = async () => {
    setError('')
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/checkuserinfo`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShops(res.data.shops || []);

    } catch (err) {
      console.log(err);
      setError('We could not load your shops. Check your connection and try again.')
    }
    setLoading(false)
  };

  useEffect(() => {
    fun1();
  }, [token]);

  return (
    <section className="cn" aria-labelledby="cn-heading">
      <h2 id="cn-heading" className="section-title">Your shops</h2>

      {loading && (
        <div className="cn-grid" aria-busy="true" aria-label="Loading your shops">
          {[0, 1, 2].map((i) => <div key={i} className="skeleton cn-skel" />)}
        </div>
      )}

      {!loading && error && (
        <div className="alert alert-error" role="alert">
          <p>{error}</p>
          <button type="button" className="btn btn-secondary btn-small cn-retry" onClick={() => { setLoading(true); fun1() }}>Try again</button>
        </div>
      )}

      {!loading && !error && closedMsg && (
        <p className="alert alert-info" role="status">{closedMsg}</p>
      )}

      {!loading && !error && shops.length > 0 && (
        <ul className="cn-grid">
          {shops.map((shop, index) => {
            const info = shop.ui?.generalinfo || {}
            const isClosed = shop.shopOpenOrNot === 'Closed'
            const name = info.BusinessName || 'Shop'
            return (
              <li key={shop._id || index}>
                <button
                  type="button"
                  className={`cn-shop${isClosed ? ' is-closed' : ''}`}
                  style={{
                    backgroundColor: info.BackgroundColor || undefined,
                    backgroundImage: info.Backgroundimage ? `url(${info.Backgroundimage})` : undefined,
                  }}
                  onClick={() => {
                    if (shop.shopOpenOrNot === 'Open') {
                      setClosedMsg('')
                      navigate("/Shopnox", {
                        state: {
                          id: shop._id
                        }
                      })
                    } else {
                      setClosedMsg(`${name} is closed right now. Please try again later.`)
                    }
                  }}
                >
                  <span className="cn-name" style={{ color: info.TextColor || undefined }}>{name}</span>
                  <span className={`pill ${isClosed ? 'pill-bad' : 'pill-ok'}`}>{isClosed ? 'Closed' : 'Open'}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {!loading && !error && shops.length === 0 && (
        <div className="empty-state">
          <p>You have not added any shops yet. Search for a shop near you to get started.</p>
          <button type="button" className="btn btn-primary" onClick={() => navigate("/searchbox")}>Find a shop</button>
        </div>
      )}
    </section>
  )
}

export default Connections
