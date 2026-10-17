import React from 'react'
import './wallet.css'
import Header2 from './header2'
import { useLocation } from 'react-router-dom'
import Wallettotalamount from './wallettotalamount'
import Walletwithdrawbtn from './walletwithdrawbtn'

const Wallet = () => {
    const location = useLocation()

    return (
        <div className="page">
            {location.pathname === "/Wallet" && <Header2 />}

            <main className="page-body is-narrow wl-main">
                <h1 className="page-title">Wallet</h1>
                <Wallettotalamount />
                <Walletwithdrawbtn />
            </main>
        </div>
    );
};

export default Wallet;
