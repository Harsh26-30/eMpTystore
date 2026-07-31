import React, { useEffect, useState } from 'react';
import './UserProfile.css'; // Import CSS for styling
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Shopnox from './Shopnox';


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
    const [sellerEmailId, setsellerEmailId] = useState('');
    const [BackgroundImg, setBackgroundImg] = useState('');
    const [totalordertillnow, settotalordertillnow] = useState("0");

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
            setBackgroundImg(res.data.backgroundimg);
            settotalordertillnow(res.data.totalordertillnow)

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


    useEffect(() => {
        // Fetch user profile data from the backend API


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
                setsellerEmailId(resParam.data.email)
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
        fetchUserProfile()
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
                { connectionid: sellerEmailId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert(res.data.message);
            navigate("/home");

        } catch (err) {
            console.log("Search error:", err);
        }
    };

    return (
        <div className="userprofilemainbox">
            <div id='userprofile'>
                <div id='bkimgpimgnamebox1'>
                    <div id='bkimgbox'>
                        <img src={BackgroundImg} alt="background Image" />
                    </div>
                    <div id='profileimg' onClick={handleprofileimgclick}>
                        <div id='insidepimg'>
                            <img
                                src={profilePicture || "/shop-with-sign-open-design_23-2148544029.jpg"}
                                alt="Profile Image"
                            />
                        </div>
                    </div>
                    <div id='namebox'>
                        <h3>{bussinessname}</h3>
                    </div>
                </div>
                <div id='totn'>
                    <p>total order till now</p>
                    <h3>{totalordertillnow || 0}</h3>
                </div>

                <div className="profilebuttonsection">
                    {!SellerId && <button onClick={handleclickShare} className="ShareProfileButton">Share Profile</button>
                    }     
                   <button
                        onClick={() => navigate(`/Shopnox/${SellerId}`)}
                        className="ShareProfileButton"
                    >
                        Shop here
                    </button>
                </div>
            </div>
            {/* {userRole === "Customer" && (
                <div className="profilebuttonsection">
                    <button onClick={handleclickConnectToShop} className="ConnectToShopButton">Connect To Shop</button>
                </div>
            )} */}
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