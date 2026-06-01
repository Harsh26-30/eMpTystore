import React, { useEffect, useState } from 'react';
import './Shoporsellerprofile.css'; // Import CSS for styling
import axios from 'axios';
import { useParams } from "react-router-dom";

const Shoporsellerprofile = () => {
    const token = localStorage.getItem("token");
    const { seller_key } = useParams();

    const [bussinessname, setBussinessName] = useState('');
    const [AboutUs, setAboutUs] = useState('About Us');
    const [changeProfilePicformvisible, setchangeProfilePicformvissible] = useState(false);
    const [profilePicture, setProfilePicture] = useState('');

    useEffect(() => {
        if (!seller_key) return;   // 🚨 STOP undefined calls

        const fetchshoporsellerProfile = async () => {
            try {
                const res3 = await axios.get(
                    `${import.meta.env.VITE_API_URL}/profile/${seller_key}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setBussinessName(res3.data.BusinessName);
                setAboutUs(res3.data.Aboutus);
                setProfilePicture(res3.data.profilePicture);
                console.log("seller_key:", seller_key);
console.log("API URL:", `${import.meta.env.VITE_API_URL}/profile/${seller_key}`);

            } catch (err) {
                console.error("Error fetching profile:", err);
            }
        };

        fetchshoporsellerProfile();
    }, [token, seller_key]); // ✅ IMPORTANT: Add dependencies

    const handleblurAboutus = async () => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/updateprofileAboutus`, { Aboutus: AboutUs }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (err) {
            console.error("Error updating shoporseller profile:", err);
        }
    };

    const handleprofileimgclick = async () => {
        // Logic to handle profile image click (e.g., open file dialog, upload new image, etc.)
        setchangeProfilePicformvissible(true);
    }

    const handleChangeProfilePicSubmit = async (e) => {
        e.preventDefault();
        try {
            const fileInput = document.getElementById('profilePictureInput');
            const formData = new FormData();
            formData.append('profilePicture', fileInput.files[0]);
            await axios.put(`${import.meta.env.VITE_API_URL}/updateprofilePicture`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (err) {
            console.error("Error updating profile picture:", err);
        }
        setchangeProfilePicformvissible(false);
    };

    const handleclickShare = async () => {
        const shareLink = `${window.location.origin}/profile/${seller_key}`;

        try {
            await navigator.share({
                title: "Check out my profile",
                url: shareLink,
            });
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div className="shoporsellerprofilemainbox">
            <div className="box2shoporsellerprofilebox">
                <div className="profiledetails">
                    <div onClick={handleprofileimgclick} className="profilepicture">
                        <img src={profilePicture || "/E.png"} alt="Profile" />
                    </div>
                    <div className="shoporsellername">
                        <h2>{bussinessname}</h2>
                    </div>
                </div>
                <div className="contactsandaboutmesection">
                    <textarea type="text" value={AboutUs} onChange={(e) => { setAboutUs(e.target.value) }} onBlur={handleblurAboutus} />
                </div>
            </div>

            <div className="profilebuttonsection">
                <button onClick={handleclickShare} className="ShareProfileButton">Share Profile</button>
            </div>


            <div className="profilebuttonsection">
                <button className="ShareProfileButton">Connect To Shop</button>
            </div>

            {changeProfilePicformvisible === true && (
                <div className="changeprofilepicturesection">
                    <form onSubmit={handleChangeProfilePicSubmit}>
                        <input type="file" id="profilePictureInput" name="profilePicture" accept="image/*" />
                        <button type="submit">Change Profile Picture</button>
                    </form>
                </div>
            )}
            <p className="end">---End of these page---</p>
        </div>
    );
};

export default Shoporsellerprofile;