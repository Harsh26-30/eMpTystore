import React, { useEffect, useState } from 'react';
import './Shoporsellerprofile.css';
import axios from 'axios';
import { useParams } from "react-router-dom";
import defaultImg from "../assets/E.png";

const Shoporsellerprofile = () => {
    const token = localStorage.getItem("token");
    const { seller_key } = useParams();

    const [bussinessname, setBussinessName] = useState('');
    const [AboutUs, setAboutUs] = useState('About Us');
    const [changeProfilePicformvisible, setchangeProfilePicformvissible] = useState(false);
    const [profilePicture, setProfilePicture] = useState('');

    useEffect(() => {
        if (!seller_key) return;

        const fetchshoporsellerProfile = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/profile/${seller_key}`,
                    {
                        headers: token
                            ? { Authorization: `Bearer ${token}` }
                            : {}
                    }
                );

                console.log("PROFILE API RESPONSE:", res.data);

                setBussinessName(res.data.BusinessName || "");
                setAboutUs(res.data.Aboutus?.trim() || "About Us");
                setProfilePicture(res.data.profilePicture || "");

            } catch (err) {
                console.error("Error fetching profile:", err);
            }
        };

        fetchshoporsellerProfile();
    }, [seller_key, token]);

    const handleblurAboutus = async () => {
        try {
            await axios.put(
                `${import.meta.env.VITE_API_URL}/updateprofileAboutus`,
                { Aboutus: AboutUs },
                {
                    headers: token
                        ? { Authorization: `Bearer ${token}` }
                        : {}
                }
            );
        } catch (err) {
            console.error("Error updating About Us:", err);
        }
    };

    const handleprofileimgclick = () => {
        setchangeProfilePicformvissible(true);
    };

    const handleChangeProfilePicSubmit = async (e) => {
        e.preventDefault();

        try {
            const fileInput = document.getElementById('profilePictureInput');

            if (!fileInput?.files?.length) return;

            const formData = new FormData();
            formData.append('profilePicture', fileInput.files[0]);

            await axios.put(
                `${import.meta.env.VITE_API_URL}/updateprofilePicture`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: token ? `Bearer ${token}` : ""
                    },
                }
            );

        } catch (err) {
            console.error("Error updating profile picture:", err);
        }

        setchangeProfilePicformvissible(false);
    };

    const handleclickShare = async () => {
        const shareLink = `${window.location.origin}/profile/${seller_key}`;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: "Check out my profile",
                    url: shareLink,
                });
            } else {
                navigator.clipboard.writeText(shareLink);
                alert("Link copied to clipboard!");
            }
        } catch (err) {
            console.log("Share failed:", err);
        }
    };

    return (
        <div className="shoporsellerprofilemainbox">

            <div className="box2shoporsellerprofilebox">

                <div className="profiledetails">
                    <div
                        onClick={handleprofileimgclick}
                        className="profilepicture"
                    >
                        <img
                            src={profilePicture || defaultImg}
                            alt="Profile"
                        />
                    </div>

                    <div className="shoporsellername">
                        <h2>{bussinessname}</h2>
                    </div>
                </div>

                <div className="contactsandaboutmesection">
                    <textarea
                        value={AboutUs}
                        onChange={(e) => setAboutUs(e.target.value)}
                        onBlur={handleblurAboutus}
                    />
                </div>

            </div>

            <div className="profilebuttonsection">
                <button
                    onClick={handleclickShare}
                    className="ShareProfileButton"
                >
                    Share Profile
                </button>
            </div>

            <div className="profilebuttonsection">
                <button className="ShareProfileButton">
                    Connect To Shop
                </button>
            </div>

            {changeProfilePicformvisible && (
                <div className="changeprofilepicturesection">
                    <form onSubmit={handleChangeProfilePicSubmit}>
                        <input
                            type="file"
                            id="profilePictureInput"
                            accept="image/*"
                        />
                        <button type="submit">
                            Change Profile Picture
                        </button>
                    </form>
                </div>
            )}

            <p className="end">---End of this page---</p>

        </div>
    );
};

export default Shoporsellerprofile;