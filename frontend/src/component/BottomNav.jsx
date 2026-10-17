import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import './BottomNav.css'

const SHOW_ON = ['/home', '/searchbox', '/myOrderStatus', '/UserProfile', '/Menu', '/Cart', '/shareAndEarn', '/AboutUs']

const icons = {
  home: <path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V11z" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>,
  orders: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h4" /></>,
  profile: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
}

const TABS = [
  { to: '/home', label: 'Home', icon: 'home' },
  { to: '/searchbox', label: 'Search', icon: 'search' },
  { to: '/myOrderStatus', label: 'Orders', icon: 'orders' },
  { to: '/UserProfile', label: 'Profile', icon: 'profile' },
]

const BottomNav = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const [role, setRole] = useState('')

  useEffect(() => {
    if (!token) { setRole(''); return }
    axios.get(`${import.meta.env.VITE_API_URL}/checkuserinfo`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setRole(res.data.role))
      .catch(() => {})
  }, [token, pathname])

  const visible = role === 'Customer' && SHOW_ON.includes(pathname)

  useEffect(() => {
    document.body.classList.toggle('has-bottomnav', visible)
    return () => document.body.classList.remove('has-bottomnav')
  }, [visible])

  if (!visible) return null

  return (
    <nav className="bn" aria-label="Main">
      {TABS.map((t) => (
        <button
          key={t.to}
          type="button"
          className="bn-tab"
          aria-current={pathname === t.to ? 'page' : undefined}
          onClick={() => navigate(t.to)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[t.icon]}</svg>
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  )
}

export default BottomNav
