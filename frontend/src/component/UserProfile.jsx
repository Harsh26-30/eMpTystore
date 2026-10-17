import React, { useEffect, useState } from 'react';
import './UserProfile.css';
import './modal.css';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Header2 from './header2';


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
    const [notice, setNotice] = useState('');
    const [saving, setSaving] = useState(false);
    const [chosenFile, setChosenFile] = useState(null);

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
        if (!chosenFile) return;
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('profilePicture', chosenFile);
            await axios.put(`${import.meta.env.VITE_API_URL}/updateprofilePicture`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (err) {
            console.error("Error updating profile picture:", err);
            setNotice('We could not change your picture. Please try again.');
            setTimeout(() => setNotice(''), 3000);
        }
        setSaving(false);
        setChosenFile(null);
        setchangeProfilePicformvissible(false);
        fetchUserProfile()
    };

    const handleclickShare = async () => {
        const shareLink = `${window.location.origin}/profile/${currentUserId}`;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: "Check out my profile",
                    url: shareLink,
                });
            } else {
                await navigator.clipboard.writeText(shareLink);
                setNotice('Profile link copied.');
                setTimeout(() => setNotice(''), 3000);
            }
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
            setNotice(res.data.message);
            navigate("/home");

        } catch (err) {
            console.log("Search error:", err);
        }
    };

    const isOwnProfile = SellerId;

    return (
        <div className="page">
            <Header2 />
            <main className="page-body is-narrow up-main">
                <section className="up-card" aria-label="Profile">
                    <div className="up-cover">
                        {BackgroundImg && <img src={BackgroundImg} alt="" />}
                    </div>

                    <div className="up-identity">
                        <button
                            type="button"
                            className="up-avatar"
                            onClick={handleprofileimgclick}
                            aria-label={userRole ? 'Change profile picture' : 'Profile picture'}
                            disabled={!userRole || !isOwnProfile}
                        >
                            <img
                                src={profilePicture || "/shop-with-sign-open-design_23-2148544029.jpg"}
                                alt=""
                            />
                        </button>
                        <h1 className="up-name">{bussinessname || 'Your shop'}</h1>
                        {AboutUs && <p className="up-about">{AboutUs}</p>}
                    </div>

                    <div className="up-stat">
                        <span className="up-stat-number money">{totalordertillnow || 0}</span>
                        <span className="up-stat-label">orders so far</span>
                    </div>

                    <div className="up-actions">
                        {isOwnProfile && (
                            <button type="button" onClick={handleclickShare} className="btn btn-secondary">
                                Share profile
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => navigate(`/Shopnox/${SellerId}`)}
                            className="btn btn-primary"
                        >
                            Shop here
                        </button>
                    </div>
                </section>
            </main>

            {changeProfilePicformvisible === true && userRole && (
                <div className="modal-backdrop" onClick={() => !saving && setchangeProfilePicformvissible(false)}>
                    <div
                        className="modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="up-pic-title"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 id="up-pic-title">Change profile picture</h2>
                        <form className="modal-form" onSubmit={handleChangeProfilePicSubmit}>
                            <div className="modal-field">
                                <label htmlFor="profilePictureInput">Choose a photo</label>
                                <input
                                    type="file"
                                    id="profilePictureInput"
                                    name="profilePicture"
                                    accept="image/*"
                                    onChange={(e) => setChosenFile(e.target.files[0] || null)}
                                />
                            </div>
                            <button className="modal-primary" type="submit" disabled={!chosenFile || saving}>
                                {saving ? 'Uploading…' : 'Save picture'}
                            </button>
                        </form>
                        <button type="button" className="modal-secondary" onClick={() => setchangeProfilePicformvissible(false)} disabled={saving}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {notice && <p className="toast" role="status">{notice}</p>}
        </div>
    );
};

export default UserProfile;