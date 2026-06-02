import React, { useEffect, useState } from 'react';
import './UserProfile.css'; // Import CSS for styling
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';


const UserProfile = () => {
    const token = localStorage.getItem("token");
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [bussinessname, setBussinessName] = useState('');
    const [AboutUs, setAboutUs] = useState('About Us');
    const [userRole, setuserRole] = useState('');
    const [changeProfilePicformvisible, setchangeProfilePicformvissible] = useState(false);
    const [profilePicture, setProfilePicture] = useState('');
    const [SellerId, setSellerId] = useState('');
    const [currentUserId, setcurrentUserId] = useState('');




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
                setcurrentUserId(res2.data.id);


            } catch (err) {
                console.error("Error fetching user profile:", err);
            }
        };

        fetchUserProfile();
    }, [token]);

    useEffect(() => {
        async function fetchProfileData() {
            if (id) {
                const resParam = await axios.get(`${import.meta.env.VITE_API_URL}/shoporsellerprofile/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSellerId(id);
                setBussinessName(resParam.data.BusinessName);
                setAboutUs(resParam.data.Aboutus);
                setProfilePicture(resParam.data.profilePicture);
                console.log("Profile data fetched successfully:", id);

            }
        }
        fetchProfileData();
    }, [id, token]);


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
        const shareLink = `${window.location.origin}/profile/${currentUserId}`;

        try {
            await navigator.share({
                title: "Check out my profile",
                url: shareLink,
            });
        } catch (err) {
            console.log(err);
        }
    };

    const handleclickConnectToShop = async (e) => {
        e.preventDefault();

        try {
            // not logged in → send to login with state
            if (!token) {
                navigate("/", {
                    state: { from: location }
                });
                return;
            }

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/buildconnection`,
                { connectionid: SellerId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(res.data);

        } catch (err) {
            console.log("Search error:", err);
        }
    };

    return (
        <div className="userprofilemainbox">
            <div className="box2userprofilebox">
                <div className="profiledetails">
                    <div onClick={handleprofileimgclick} className="profilepicture">
                        <img src={profilePicture || "/E.png"} alt="Profile" />
                    </div>
                    <div className="username">
                        <h2>{bussinessname}</h2>
                    </div>
                </div>
                <div className="contactsandaboutmesection">
                    {userRole === "Seller" && (
                        <textarea type="text" value={AboutUs} onChange={(e) => { setAboutUs(e.target.value) }} onBlur={handleblurAboutus} />
                    )}
                    {userRole === "Customer" && <p className="contactdetails">{AboutUs}</p>}
                </div>
            </div>
            {userRole === "Seller" && (
                <div className="profilebuttonsection">
                    <button onClick={handleclickShare} className="ShareProfileButton">Share Profile</button>
                </div>
            )}

            {SellerId && currentUserId && currentUserId !== SellerId && (
                    <button onClick={handleclickConnectToShop} className="ConnectToShopButton">Connect To Shop</button>
            )}
            {changeProfilePicformvisible === true && userRole && (
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