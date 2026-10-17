import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Header2 from './header2'
import OrderQr from './OrderQr'
import './MyOrderStatus.css'
import './modal.css'

// How each order status reads to a customer
const STATUS = {
  Pending: { label: 'Waiting for the shop', tone: 'warn', step: 1 },
  pending: { label: 'Waiting for the shop', tone: 'warn', step: 1 },
  Confirm: { label: 'Being prepared', tone: 'info', step: 2 },
  preparing: { label: 'Being prepared', tone: 'info', step: 2 },
  RFD: { label: 'Ready for delivery', tone: 'info', step: 3 },
  OFD: { label: 'Out for delivery', tone: 'info', step: 4 },
  Reached: { label: 'Delivered', tone: 'ok', step: 5 },
  Rejected: { label: 'Rejected by the shop', tone: 'bad', step: 0 }
}

const STEPS = ['Placed', 'Preparing', 'Ready', 'On the way', 'Delivered']

const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`

const MyOrderStatus = () => {
  const token = localStorage.getItem('token')
  const [SelectedOrder, setSelectedOrder] = useState(null)
  const [orders, setOrders] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [tab, setTab] = useState('active')

  const fetchOrderStatus = async () => {
    setStatus('loading')
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/myOrderStatus`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setOrders(Array.isArray(res.data) ? res.data : [])
      setStatus('ready')
    } catch (error) {
      console.error('Error fetching order status:', error)
      setStatus('error')
    }
  }

  useEffect(() => {
    if (!token) return
    fetchOrderStatus()
  }, [token])

  return (
    <div className="page">
      <Header2 />
      <main className="page-body is-narrow">
        <h1 className="page-title">My orders</h1>

        {status === 'loading' && (
          <div className="stack mo-gap" aria-busy="true" aria-label="Loading your orders">
            <div className="skeleton" />
            <div className="skeleton" />
          </div>
        )}

        {status === 'error' && (
          <div className="empty-state mo-gap" role="alert">
            <p>We could not load your orders. Check your connection and try again.</p>
            <button type="button" className="btn btn-secondary" onClick={fetchOrderStatus}>Try again</button>
          </div>
        )}

        {status === 'ready' && orders.length === 0 && (
          <div className="empty-state mo-gap">
            <p>You have not placed an order yet. Orders you place will show up here.</p>
          </div>
        )}

        {status === 'ready' && orders.length > 0 && (
          <div className="mo-seg" role="tablist" aria-label="Order list">
            <button type="button" role="tab" aria-selected={tab === 'active'} onClick={() => setTab('active')}>Active</button>
            <button type="button" role="tab" aria-selected={tab === 'past'} onClick={() => setTab('past')}>Past</button>
          </div>
        )}

        {status === 'ready' && orders.length > 0 && orders.filter((o) => (o.orderStatus !== 'Reached' && o.orderStatus !== 'Rejected') === (tab === 'active')).length === 0 && (
          <div className="empty-state mo-gap"><p>{tab === 'active' ? 'No active orders right now.' : 'No past orders yet.'}</p></div>
        )}

        {status === 'ready' && orders.length > 0 && (
          <ul className="mo-list">
            {orders.filter((o) => (o.orderStatus !== 'Reached' && o.orderStatus !== 'Rejected') === (tab === 'active')).map((order) => {
              const info = STATUS[order.orderStatus] || { label: 'Checking status', tone: '', step: 0 }
              const total = order.items?.reduce(
                (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0
              )
              const open = order.orderStatus !== 'Reached' && order.orderStatus !== 'Rejected'

              return (
                <li key={order._id} className="card mo-card">
                  <div className="mo-head">
                    <div className="mo-shop">
                      <h2 className="section-title">{order.sellerOrShopName || 'Shop'}</h2>
                    </div>
                    <span className={`pill pill-${info.tone}`}>{info.label}</span>
                  </div>

                  {info.step > 0 && (
                    <ol className="mo-steps" aria-label="Order progress">
                      {STEPS.map((label, index) => (
                        <li
                          key={label}
                          className={index + 1 <= info.step ? 'is-done' : undefined}
                          aria-current={index + 1 === info.step ? 'step' : undefined}
                        >
                          <span className="mo-dot" aria-hidden="true" />
                          <span className="mo-step-label">{label}</span>
                        </li>
                      ))}
                    </ol>
                  )}

                  <ul className="mo-items">
                    {order.items?.map((item, index) => (
                      <li key={index}>
                        <span>{item.productname}</span>
                        <span className="mo-times">x {item.quantity}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mo-foot">
                    <span className="mo-total">Total <strong className="money">{money(total)}</strong></span>
                    {open && (
                      <button type="button" className="btn btn-secondary btn-small" onClick={() => setSelectedOrder(order)}>
                        Show QR code
                      </button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </main>

      {SelectedOrder && (
        <div className="modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div
            className="modal mo-qr"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mo-qr-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="mo-qr-title">Your order code</h2>
            <p>Show this code to the delivery partner when your order arrives.</p>
            <div className="mo-qr-box">
              <OrderQr value={SelectedOrder._id} />
            </div>
            <button type="button" className="modal-primary" onClick={() => setSelectedOrder(null)} autoFocus>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyOrderStatus
