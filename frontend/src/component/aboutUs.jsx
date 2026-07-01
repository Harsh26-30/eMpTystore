import React from 'react'
import './aboutUs.css'
import Header2 from './header2'

const aboutUs = () => {
    return (
        <div id='mainboxaboutus'>
            <Header2 />
            <div id='aboutusnav'>
                <a href="#emptyStore">Empty Store</a>
                <a href="#howWorks">How Works</a>
                <a href="#Customer">Customer</a>
                <a href="#Seller">Seller</a>
                <a href="">Delivery Partner</a>
            </div>

            <section style={{ "marginTop": '90px' }} id='emptyStore'>
                <h3>Empty Store</h3>
                <div id='content'>
                    <p>
                        Empty Store was created with a simple goal:
                        to make online shopping, selling, and delivery accessible,
                        convenient, and reliable for everyone. We bring together
                        customers looking for quality products, sellers who want
                        to grow their businesses, and delivery partners who
                        ensure orders reach their destination safely and on
                        time.
                        <hr />

                        Our platform is designed to remove the barriers between
                        buyers and businesses by providing a smooth digital
                        marketplace where every interaction is simple and secure.
                        Whether you're shopping for everyday essentials,
                        discovering new products, or expanding your business
                        to a larger audience, Empty Store offers the tools and
                        technology to make the experience effortless.
                        <hr />

                        At Empty Store, we believe technology should create
                        opportunities. By supporting local businesses,
                        improving customer convenience, and enabling flexible
                        earning opportunities for delivery partners, we aim to
                        build a stronger and more connected marketplace for
                        everyone.
                        <hr />

                        Every feature on our platform is built with trust,
                        transparency, and user satisfaction in mind.
                        As we continue to grow, our commitment remains the
                        same—to create a marketplace where customers enjoy
                        shopping, sellers achieve success, and delivery partners
                        thrive.
                    </p>
                </div>
            </section>

            <section id='howWorks'>
                <h3>How Works</h3>
                <div id='content'>
                    <p>
                        Getting started with Empty Store is quick and easy.
                        Customers can browse products, place orders,
                        and track deliveries in real time. Sellers can list
                        and manage their products through an easy-to-use
                        dashboard, while delivery partners receive assigned
                        orders and deliver them efficiently. Every step is
                        designed to ensure a smooth and reliable experience
                        for all users.
                    </p>
                </div>
            </section>

            <section id='Customer'>
                <h3>Customer</h3>
                <div id='content'>
                    <object
                        data="\1000017794.pdf"
                        type="application/pdf"
                        width="100%"
                        height="800px">
                        <p>Your browser doesn't support PDFs.
                            <a href="1000017794.pdf">Download the PDF</a>.
                        </p>
                    </object>
                </div>
            </section>
            
            <section id='Seller'>
                <h3>Seller</h3>
                <div id='content'>
                    <object
                        data="\1000017805.pdf"
                        type="application/pdf"
                        width="100%"
                        height="800px">
                        <p>Your browser doesn't support PDFs.
                            <a href="\1000017805.pdf">Download the PDF</a>.
                        </p>
                    </object>
                </div>
            </section>
        </div>
    )
}

export default aboutUs