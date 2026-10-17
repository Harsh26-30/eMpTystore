import React from 'react'
import "./shareAndEarn.css"
import Header2 from './header2'
import Wallettotalamount from './wallettotalamount'
import Walletwithdrawbtn from './walletwithdrawbtn'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from "axios"
import UpiIdForm from './upiIdForm'

const shareAndEarn = () => {
    const token = localStorage.getItem("token");
    const [sharebyname, setsharebyname] = useState()
    const [sharebyid, setsharebyid] = useState()
    const [upiId, setUpiId] = useState("");
    const [loading, setLoading] = useState(true);

    const fun = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/checkuserinfo`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setsharebyname(res.data.username);
            setsharebyid(res.data.id);

            setUpiId(res.data.kyc?.upiId?.trim() || "");

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fun()
    }, [])

    const handlegls = async () => {
        const shareLink = `${window.location.origin}/sharebydetail?name=${encodeURIComponent(
            sharebyname
        )}&id=${sharebyid}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Check out Website",
                    text: "Join Empty Store using my referral link!",
                    url: shareLink,
                });
            } catch (err) {
                console.log(err);
            }
        } else {
            await navigator.clipboard.writeText(shareLink);
            alert("Share link copied to clipboard!");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <div id='shareAndEarnmainbox'>
            <Header2 />
            <Wallettotalamount />
            <Walletwithdrawbtn />
            {
                !upiId ? (
                    <UpiIdForm setUpiId={setUpiId} />
                ) : (
                    <div id='linkbuttonbox'>
                        <button onClick={handlegls}>
                            Generate Link & Share
                        </button>
                    </div>
                )
            }

        </div>
    )
}

export default shareAndEarn