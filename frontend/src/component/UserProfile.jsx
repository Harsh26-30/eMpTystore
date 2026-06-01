import React, { useEffect, useState } from 'react';
import './UserProfile.css'; // Import CSS for styling
import axios from 'axios';

const UserProfile = () => {
    const token = localStorage.getItem("token");

    const [bussinessname, setBussinessName] = useState('');
    const [AboutUs, setAboutUs] = useState('About Us');
    const [userRole, setuserRole] = useState('');
    const [changeProfilePicformvisible, setchangeProfilePicformvissible] = useState(false);
    const [profilePicture, setProfilePicture] = useState('');
    const [sellerKey, setSellerKey] = useState('');

    useEffect(() => {
        // Fetch user profile data from the backend API
        const fetchUserProfile = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/myprofile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBussinessName(res.data.BusinessName);
                setAboutUs(res.data.Aboutus);
                setProfilePicture(res.data.profilePicture);
                const res2 = await axios.get(`${import.meta.env.VITE_API_URL}/checkuserinfo`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setuserRole(res2.data.role);
                setSellerKey(res2.data.seller_key);
            } catch (err) {
                console.error("Error fetching user profile:", err);
            }
        };

        fetchUserProfile();
    }, []);

    const handleblurAboutus = async () => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/updateprofileAboutus`, { Aboutus: AboutUs }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (err) {
            console.error("Error updating user profile:", err);
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
        const shareLink = `${window.location.origin}/profile/${sellerKey}`;

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
        <div className="userprofilemainbox">
            <div className="box2userprofilebox">
                <div className="profiledetails">
                    <div onClick={handleprofileimgclick} className="profilepicture">
                        <img src={profilePicture} alt="Profile" />
                    </div>
                    <div className="username">
                        <h2>{bussinessname}</h2>
                    </div>
                </div>
                <div className="contactsandaboutmesection">
                    <textarea type="text" value={AboutUs} onChange={(e) => { setAboutUs(e.target.value) }} onBlur={handleblurAboutus} />
                </div>
            </div>
            {userRole === "Seller" && (
                <div className="profilebuttonsection">
                    <button onClick={handleclickShare} className="ShareProfileButton">Share Profile</button>
                </div>
            )}
            {userRole === "Customer" && (
                <div className="profilebuttonsection">
                    <button className="ShareProfileButton">Connect To Shop</button>
                </div>
            )}
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

export default UserProfile;