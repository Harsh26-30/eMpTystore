import './auth.css'

// Shared frame for login, sign up and forgot password:
// a brand panel (awning, logo, short promise) next to the form.
const AuthLayout = ({ children }) => {
  return (
    <div className="auth">
      <aside className="auth-brand">
        <div className="auth-awning" aria-hidden="true" />
        <div className="auth-brand-body">
          <span className="auth-logo">
            <img src="/E.png" alt="Empty Store" />
          </span>
          <div className="auth-brand-text">
            <h1>Shops from your neighbourhood, at your door.</h1>
            <p>Order from stores near you and follow your order until it arrives.</p>
          </div>
          <ul className="auth-points">
            <li>Only shops close to you</li>
            <li>Pay online, safely</li>
            <li>Track every order</li>
          </ul>
        </div>
      </aside>
      <main className="auth-main">
        <div className="auth-card">{children}</div>
      </main>
    </div>
  )
}

export default AuthLayout
