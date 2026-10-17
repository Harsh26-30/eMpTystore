import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './header2.css'

const Header2 = ({ setmanagehomepagevisible, managehomepagevisible }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem('token')
  const [userRole, setuserRole] = useState('')
  const [shopOpenOrNot, setShopOpenOrNot] = useState(false)
  const [onServiceOrNot, setonServiceOrNot] = useState('No')

  useEffect(() => {
    if (!token) return

    const fun1 = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/checkuserinfo`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setuserRole(res.data.role)
        setShopOpenOrNot(res.data.shopOpenOrNot)
        setonServiceOrNot(res.data.onServiceOrNot)
      } catch (err) {
        console.log(err)
      }
    }

    fun1()
  }, [token])

  const handleShopOpenOrNotToggle = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/toggleShopOpenOrNot`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setShopOpenOrNot(res.data.shopOpenOrNot)
    } catch (err) {
      console.log(err)
    }
  }

  const handledponServiceorNotToggle = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/dponServiceorNotToggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setonServiceOrNot(res.data.onServiceOrNot)
    } catch (err) {
      console.log(err)
    }
  }

  const shopIsOpen = shopOpenOrNot === 'Open'
  const onService = onServiceOrNot === 'Yes'

  return (
    <header className="hd">
      <div className="hd-bar">
        <button type="button" className="hd-logo" onClick={() => navigate('/home')} aria-label="Empty Store home">
          <img src="/E.png" alt="" />
        </button>

        <nav className="hd-actions" aria-label="Main">
          {userRole === 'Seller' && (
            <button
              type="button"
              role="switch"
              aria-checked={shopIsOpen}
              className="hd-switch"
              onClick={handleShopOpenOrNotToggle}
            >
              <span className="hd-track"><span className="hd-knob" /></span>
              <span className="hd-switch-label">{shopIsOpen ? 'Shop open' : 'Shop closed'}</span>
            </button>
          )}

          {userRole === 'Delivery_partner' && (
            <button
              type="button"
              role="switch"
              aria-checked={onService}
              className="hd-switch"
              onClick={handledponServiceorNotToggle}
            >
              <span className="hd-track"><span className="hd-knob" /></span>
              <span className="hd-switch-label">{onService ? 'On service' : 'Not in service'}</span>
            </button>
          )}

          {false && (
            <button type="button" className="hd-btn" onClick={() => navigate('/myOrderStatus')}>
              <img src="/format_list_bulleted_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png" alt="" />
              <span>My orders</span>
            </button>
          )}

          {(userRole === 'Seller' || userRole === 'Delivery_partner') && (
            <button type="button" className="hd-btn" onClick={() => navigate('/Wallet')}>
              <img src="/account_balance_wallet_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png" alt="" />
              <span>Wallet</span>
            </button>
          )}

          <button type="button" className="hd-btn" onClick={() => navigate('/Menu')}>
            <img src="/menu_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png" alt="" />
            <span>Menu</span>
          </button>
        </nav>
      </div>

      {userRole === 'Seller' && location.pathname === '/home' && (
        <div className="hd-tabs" role="tablist" aria-label="Shop sections">
          {[
            ['Order', 'Orders'],
            ['Product', 'Products'],
            ['UI', 'Shop style']
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              className="hd-tab"
              aria-selected={managehomepagevisible === key}
              onClick={() => setmanagehomepagevisible(key)}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </header>
  )
}

export default Header2
