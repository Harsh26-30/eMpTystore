import React, { useCallback, useEffect, useRef, useState } from 'react'
import './Order.css'
import axios from 'axios'
import QrScanner from "./QrScanner"
import { useNavigate } from "react-router-dom";
import RejectpOrderform from './rejectpOrderform';

const rupees = (n) => `₹${(Number(n) || 0).toLocaleString('en-IN')}`

const orderTotal = (order) =>
  (order.items || []).reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0), 0)

const formatWhen = (value) => {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
}

// Order statuses used by the backend, in the order a seller works through them
const GROUPS = [
  {
    key: 'new',
    status: 'Pending',
    tab: 'New',
    pill: 'New order',
    empty: 'No new orders right now. New orders from customers will show up here.',
  },
  {
    key: 'preparing',
    status: 'Confirm',
    tab: 'Preparing',
    pill: 'Preparing',
    empty: 'You are not preparing any orders right now.',
  },
  {
    key: 'pickup',
    status: 'RFD',
    tab: 'Ready for pickup',
    pill: 'Ready for pickup',
    empty: 'Nothing is waiting for pickup. Mark an order as ready once it is packed.',
  },
]

const Order = () => {
  const token = localStorage.getItem("token");
  const [orders, setrorders] = useState([])
  const [userRole, setuserRole] = useState('')
  const [roleChecked, setRoleChecked] = useState(false)
  const [loadState, setLoadState] = useState('loading') // loading | ready | error
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();
  const [clat, setclat] = useState('')
  const [clong, setclong] = useState('')
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [rejectpOrderform, setrejectpOrderform] = useState(false);
  const [activeGroup, setActiveGroup] = useState('new')
  const [confirmingId, setConfirmingId] = useState(null)
  const [busyId, setBusyId] = useState(null)
  const [notice, setNotice] = useState(null)
  const noticeTimer = useRef(null)

  const showNotice = (text, tone = 'ok') => {
    setNotice({ text, tone })
    clearTimeout(noticeTimer.current)
    noticeTimer.current = setTimeout(() => setNotice(null), 4500)
  }

  const fetchOrders = async () => {
    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const clatitude = position.coords.latitude;
          const clongitude = position.coords.longitude;
          setclat(clatitude)
          setclong(clongitude)
        },
        (error) => {
          console.log(error.message);
        }
      );

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/Orders`,
        {}, // empty body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setrorders(res.data.orders)
      setLoadState('ready')
    } catch (err) {
      console.error(err);
      setLoadState((prev) => (prev === 'ready' ? 'ready' : 'error'))
    }
  };


  const fun1 = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/checkuserinfo`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setuserRole(res.data.role);
    } catch (err) {
      console.log(err);
    } finally {
      setRoleChecked(true)
    }
  };

  const retry = () => {
    setLoadState('loading')
    setRoleChecked(false)
    fetchOrders();
    fun1();
  }

  useEffect(() => {
    fetchOrders();
    fun1();
    return () => clearTimeout(noticeTimer.current)
  }, [token]);

  const handleconfirm = async (e) => {
    setBusyId(e)
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/confirmOrders`,
        { orderid: e },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showNotice('Order accepted. It is now in Preparing.')
    } catch (err) {
      console.error(err)
      showNotice(err.response?.data?.message || 'We could not accept this order. Please try again.', 'error')
    }
    setConfirmingId(null)
    setBusyId(null)
    fetchOrders();
  }

  const handlereadyforshipment = async (e) => {
    setBusyId(e)
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/readyforDelivary`,
        { orderid: e, clat, clong },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showNotice('Marked as ready for pickup.')
      fetchOrders();

    } catch (err) {
      console.log("REAL ERROR:", err.response?.data);
      showNotice(err.response?.data?.message || 'We could not update this order. Please try again.', 'error')
    }
    setBusyId(null)
    fetchOrders();

  };

  const handleScan = (order) => {
    setSelectedOrder(order);
    setShowScanner(true);
  };

  const handleOutfordelivary = async (e) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/Outfordelivary`,
        { orderid: e },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showNotice('Order handed over. It is now out for delivery.')

      await fetchOrders();

    } catch (err) {
      console.log("REAL ERROR:", err.response?.data);
      showNotice(err.response?.data?.message || 'We could not update this order. Please try again.', 'error')
    }
  };

  const closeScanner = () => {
    setShowScanner(false)
    setSelectedOrder(null)
  }

  const onScanResult = useCallback(async (result) => {
    const scannedValue =
      typeof result === "string"
        ? result
        : result?.text;

    if (!scannedValue) {
      return;
    }

    const orderId = selectedOrder?._id;

    if (!orderId) {
      return;
    }

    const expected = String(orderId);

    if (scannedValue.trim().includes(expected)) {
      showNotice('Correct order scanned.')

      setShowScanner(false);
      setSelectedOrder(null);

      try {
        await handleOutfordelivary(orderId);
        navigate("/home");
      } catch (err) {
        console.error(err);
        showNotice('We could not update this order. Please try again.', 'error')
      }

    } else {
      showNotice('This QR code is for a different order. Check the parcel and scan again.', 'error')

      setShowScanner(false);
      setSelectedOrder(null);

      navigate("/home");
    }
  }, [selectedOrder, navigate])

  // Keyboard: Escape closes the scanner
  useEffect(() => {
    if (!showScanner) return undefined
    const onKey = (e) => { if (e.key === 'Escape') closeScanner() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [showScanner])

  const list = Array.isArray(orders) ? orders : []
  const grouped = GROUPS.map((g) => ({ ...g, rows: list.filter((o) => o.orderstatus === g.status) }))
  const current = grouped.find((g) => g.key === activeGroup) || grouped[0]

  const renderActions = (order) => {
    const busy = busyId === order._id
    if (order.orderstatus === 'Pending') {
      if (confirmingId === order._id) {
        return (
          <div className="so-confirm" role="group" aria-label="Confirm accepting this order">
            <p>Accept this order? The items will be taken off your stock.</p>
            <div className="so-actions">
              <button type="button" className="so-btn so-btn-secondary" onClick={() => setConfirmingId(null)} disabled={busy}>
                Not yet
              </button>
              <button type="button" className="so-btn so-btn-primary" onClick={() => handleconfirm(order._id)} disabled={busy}>
                {busy ? 'Accepting…' : 'Yes, accept'}
              </button>
            </div>
          </div>
        )
      }
      return (
        <div className="so-actions is-three">
          <button
            type="button"
            className="so-btn so-btn-danger"
            onClick={() => { setrejectpOrderform(true); setSelectedOrderId(order._id); }}
          >
            Reject
          </button>
          <a className="so-btn so-btn-secondary" href={`tel:${order.phoneNo}`}>Call customer</a>
          <button type="button" className="so-btn so-btn-primary" onClick={() => setConfirmingId(order._id)}>
            Accept order
          </button>
        </div>
      )
    }
    if (order.orderstatus === 'Confirm') {
      return (
        <div className="so-actions">
          <button
            type="button"
            className="so-btn so-btn-primary"
            onClick={() => handlereadyforshipment(order._id)}
            disabled={busy}
          >
            {busy ? 'Updating…' : 'Mark as ready for pickup'}
          </button>
        </div>
      )
    }
    if (order.orderstatus === 'RFD') {
      return (
        <div className="so-actions">
          <button type="button" className="so-btn so-btn-primary" onClick={() => handleScan(order)}>
            Scan QR to hand over
          </button>
        </div>
      )
    }
    return null
  }

  const renderCard = (order, group) => {
    const items = Array.isArray(order.items) ? order.items : []
    const when = formatWhen(order.order_date)
    return (
      <li key={order._id} className="so-card">
        <div className="so-card-head">
          <div className="so-card-title">
            <h4>Order #{String(order._id).slice(-6).toUpperCase()}</h4>
            <p>{[order.customername, when].filter(Boolean).join(' · ')}</p>
          </div>
          <span className={`so-pill is-${group.key}`}>{group.pill}</span>
        </div>

        <ul className="so-items">
          {items.map((item, i) => (
            <li key={i}>
              <span className="so-qty">{item.quantity} ×</span>
              <span className="so-name">{item.productname}</span>
              <span className="so-line">{rupees((Number(item.quantity) || 0) * (Number(item.price) || 0))}</span>
            </li>
          ))}
        </ul>

        <div className="so-total">
          <span>Order total</span>
          <strong>{rupees(orderTotal(order))}</strong>
        </div>

        {order.phoneNo && order.orderstatus !== 'Pending' && (
          <p className="so-phone">
            Customer phone: <a href={`tel:${order.phoneNo}`}>{order.phoneNo}</a>
          </p>
        )}

        {renderActions(order)}
      </li>
    )
  }

  const loading = loadState === 'loading' || (loadState === 'ready' && !roleChecked)

  return (
    <section className="so" aria-labelledby="so-heading">
      {rejectpOrderform && <RejectpOrderform orderid={selectedOrderId} fetchOrders={fetchOrders} setrejectpOrderform={setrejectpOrderform} />}

      {loading && (
        <div aria-busy="true" aria-label="Loading orders">
          <div className="so-skel so-skel-tabs" />
          <div className="so-grid">
            {[0, 1, 2].map((i) => <div key={i} className="so-skel" />)}
          </div>
        </div>
      )}

      {!loading && loadState === 'error' && (
        <div className="so-message" role="alert">
          <p>We could not load your orders. Check your internet connection and try again.</p>
          <button type="button" className="so-btn so-btn-secondary" onClick={retry}>Try again</button>
        </div>
      )}

      {!loading && loadState === 'ready' && userRole === "Seller" && (
        <>
          <div className="so-top">
            <h2 id="so-heading">Orders</h2>
            <button type="button" className="so-btn so-btn-secondary so-small" onClick={fetchOrders}>Refresh</button>
          </div>

          <div className="so-filters" role="group" aria-label="Order stage">
            {grouped.map((g) => (
              <button
                key={g.key}
                type="button"
                className="so-filter"
                aria-pressed={current.key === g.key}
                onClick={() => setActiveGroup(g.key)}
              >
                {g.tab}
                <span className="so-count">{g.rows.length}</span>
              </button>
            ))}
          </div>

          {current.rows.length > 0 ? (
            <ul className="so-grid" aria-label={current.tab}>
              {current.rows.map((order) => renderCard(order, current))}
            </ul>
          ) : (
            <div className="so-message">
              <p>{current.empty}</p>
            </div>
          )}
        </>
      )}

      {showScanner && selectedOrder && (
        <div className="so-overlay">
          <div className="so-scan" role="dialog" aria-modal="true" aria-labelledby="so-scan-title">
            <h3 id="so-scan-title">Scan the order QR</h3>
            <p>
              Point the camera at the QR code on order #{String(selectedOrder._id).slice(-6).toUpperCase()} when the delivery partner arrives.
            </p>
            <div className="so-reader">
              <QrScanner onScan={onScanResult} />
            </div>
            <button type="button" className="so-btn so-btn-secondary" onClick={closeScanner}>Cancel</button>
          </div>
        </div>
      )}

      <div className="so-toast-wrap" role="status" aria-live="polite">
        {notice && <div className={`so-toast is-${notice.tone}`}>{notice.text}</div>}
      </div>
    </section>
  )
}

export default Order
