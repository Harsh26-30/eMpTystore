import React from 'react'
import { useNavigate } from 'react-router-dom'
import './OrderStatus.css'

const OrderStatus = () => {
  const navigate = useNavigate()
  return (
    <div className="page">
      <main className="page-body is-narrow">
        <div className="empty-state os-empty">
          <h1 className="section-title">This page is not available yet</h1>
          <p>We are still building it. For now, check your orders from the home page.</p>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/home')}>Go to home</button>
        </div>
      </main>
    </div>
  )
}

export default OrderStatus
