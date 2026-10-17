import React from 'react'
import Header2 from './header2'
import './aboutUs.css'

const SECTIONS = [
    ['emptyStore', 'Empty Store'],
    ['howWorks', 'How it works'],
    ['Customer', 'For customers'],
    ['Seller', 'For sellers'],
    ['priceStruture', 'Pricing']
]

const aboutUs = () => {
    return (
        <div className="page">
            <Header2 />

            <nav className="au-nav" aria-label="On this page">
                <ul>
                    {SECTIONS.map(([id, label]) => (
                        <li key={id}><a href={`#${id}`}>{label}</a></li>
                    ))}
                </ul>
            </nav>

            <main className="page-body is-narrow au-main">
                <section id="emptyStore" className="au-section">
                    <h1 className="page-title">About Empty Store</h1>
                    <div className="au-text">
                        <p>
                            Empty Store was created with a simple goal: to make online shopping,
                            selling and delivery accessible, convenient and reliable for everyone.
                            We bring together customers looking for quality products, sellers who
                            want to grow their businesses, and delivery partners who make sure
                            orders reach their destination safely and on time.
                        </p>
                        <p>
                            Our platform is designed to remove the barriers between buyers and
                            businesses by providing a smooth digital marketplace where every
                            interaction is simple and secure. Whether you are shopping for everyday
                            essentials, discovering new products, or expanding your business to a
                            larger audience, Empty Store offers the tools to make it effortless.
                        </p>
                        <p>
                            At Empty Store, we believe technology should create opportunities. By
                            supporting local businesses, improving customer convenience, and
                            enabling flexible earning opportunities for delivery partners, we aim
                            to build a stronger and more connected marketplace for everyone.
                        </p>
                        <p>
                            Every feature on our platform is built with trust, transparency and
                            user satisfaction in mind. As we continue to grow, our commitment
                            remains the same: a marketplace where customers enjoy shopping, sellers
                            achieve success, and delivery partners thrive.
                        </p>
                    </div>
                </section>

                <section id="howWorks" className="au-section">
                    <h2 className="au-heading">How it works</h2>
                    <div className="au-text">
                        <p>
                            Getting started with Empty Store is quick and easy. Customers can browse
                            shops, place orders and track deliveries in real time. Sellers can list
                            and manage their products through an easy-to-use dashboard, while
                            delivery partners receive assigned orders and deliver them efficiently.
                            Every step is designed to give all users a smooth and reliable
                            experience.
                        </p>
                    </div>
                </section>

                <section id="Customer" className="au-section">
                    <h2 className="au-heading">For customers</h2>
                    <object className="au-pdf" data="/1000017794.pdf" type="application/pdf">
                        <p>Your browser cannot show this guide. <a href="/1000017794.pdf">Open the customer guide (PDF)</a>.</p>
                    </object>
                </section>

                <section id="Seller" className="au-section">
                    <h2 className="au-heading">For sellers</h2>
                    <object className="au-pdf" data="/1000017805.pdf" type="application/pdf">
                        <p>Your browser cannot show this guide. <a href="/1000017805.pdf">Open the seller guide (PDF)</a>.</p>
                    </object>
                </section>

                <section id="priceStruture" className="au-section">
                    <h2 className="au-heading">Pricing structure</h2>
                    <div className="au-text">
                        <p>
                            The pricing of Empty Store is simple and transparent. The seller sets
                            the price of each product. Empty Store adds a fixed delivery charge of
                            ₹30 for every order to cover delivery, and a service charge for the
                            platform and payment costs, such as order management, store management
                            and customer support.
                        </p>
                        <p>
                            The total a customer pays is the product price, plus the ₹30 delivery
                            charge, plus the service charge. The product amount goes to the seller,
                            the ₹30 delivery charge goes to the delivery partner, and the service
                            charge is kept by Empty Store to run the platform.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default aboutUs
