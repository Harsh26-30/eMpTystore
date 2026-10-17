import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header2 from './header2'
import './productview.css'

const productview = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const product = location.state

    if (!product) {
        return (
            <div className="page">
                <Header2 />
                <main className="page-body is-narrow">
                    <div className="empty-state pv-gap">
                        <p>We could not find this product. Go back and pick it again.</p>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Go back</button>
                    </div>
                </main>
            </div>
        )
    }

    const details = [
        ['Category', product.productcategory],
        ['Colour', product.productcolor],
        ['More about it', product.productextrainfo]
    ].filter(([, value]) => value)

    return (
        <div className="page">
            <Header2 />
            <main className="page-body is-narrow">
                <button type="button" className="back-link" onClick={() => navigate(-1)}>&lsaquo; Back</button>

                {product.productimage && (
                    <img className="pv-image" src={product.productimage} alt={product.productname} />
                )}

                <h1 className="page-title pv-title">{product.productname}</h1>
                <p className="pv-price money">₹{Number(product.productprice || 0).toLocaleString('en-IN')}</p>

                {details.length > 0 && (
                    <dl className="card pv-details">
                        {details.map(([label, value]) => (
                            <div key={label} className="pv-row">
                                <dt>{label}</dt>
                                <dd>{value}</dd>
                            </div>
                        ))}
                    </dl>
                )}

                <button type="button" className="btn btn-primary btn-block pv-buy" onClick={() => { navigate('/buynow', { state: product }) }}>
                    Buy now
                </button>
            </main>
        </div>
    )
}

export default productview
