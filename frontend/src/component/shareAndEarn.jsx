import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Header2 from './header2'
import Wallettotalamount from './wallettotalamount'
import Walletwithdrawbtn from './walletwithdrawbtn'
import UpiIdForm from './upiIdForm'
import './shareAndEarn.css'

const shareAndEarn = () => {
    const token = localStorage.getItem('token')
    const [sharebyname, setsharebyname] = useState()
    const [sharebyid, setsharebyid] = useState()
    const [upiId, setUpiId] = useState('')
    const [loading, setLoading] = useState(true)
    const [notice, setNotice] = useState('')
    const timer = useRef(null)

    const showNotice = (text) => {
        setNotice(text)
        clearTimeout(timer.current)
        timer.current = setTimeout(() => setNotice(''), 3000)
    }

    const fun = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/checkuserinfo`,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            setsharebyname(res.data.username)
            setsharebyid(res.data.id)
            setUpiId(res.data.kyc?.upiId?.trim() || '')
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fun()
        return () => clearTimeout(timer.current)
    }, [])

    const handlegls = async () => {
        const shareLink = `${window.location.origin}/sharebydetail?name=${encodeURIComponent(
            sharebyname
        )}&id=${sharebyid}`

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Check out Website',
                    text: 'Join Empty Store using my referral link!',
                    url: shareLink,
                })
            } catch (err) {
                console.log(err)
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareLink)
                showNotice('Link copied. Paste it in a message to share it.')
            } catch (err) {
                console.log(err)
                showNotice('We could not copy the link. Copy it from the box below.')
            }
        }
    }

    const shareLink = sharebyid
        ? `${window.location.origin}/sharebydetail?name=${encodeURIComponent(sharebyname || '')}&id=${sharebyid}`
        : ''

    return (
        <div className="page">
            <Header2 />
            <main className="page-body is-narrow">
                <h1 className="page-title">Share and earn</h1>
                <p className="page-lead">Invite friends with your link. You earn when they place orders.</p>

                {loading ? (
                    <div className="stack se-gap" aria-busy="true" aria-label="Loading">
                        <div className="skeleton" />
                        <div className="skeleton" />
                    </div>
                ) : (
                    <div className="stack se-gap">
                        <Wallettotalamount />
                        <Walletwithdrawbtn />

                        {!upiId ? (
                            <UpiIdForm setUpiId={setUpiId} />
                        ) : (
                            <section className="card se-share" aria-labelledby="se-share-title">
                                <h2 id="se-share-title" className="section-title">Your invite link</h2>
                                <p className="hint">Anyone who signs up with this link is counted as your invite.</p>
                                {shareLink && (
                                    <input
                                        id="se-link"
                                        className="input se-link"
                                        type="text"
                                        readOnly
                                        value={shareLink}
                                        aria-label="Your invite link"
                                        onFocus={(e) => e.target.select()}
                                    />
                                )}
                                <button type="button" className="btn btn-primary btn-block" onClick={handlegls}>
                                    Share my link
                                </button>
                            </section>
                        )}
                    </div>
                )}
            </main>

            {notice && <p className="toast" role="status">{notice}</p>}
        </div>
    )
}

export default shareAndEarn
