import React from 'react'
import './Request.css'
import Header2 from './header2'
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';

const Request = () => {
    const token = localStorage.getItem("token");
    const [requests, setrequests] = useState([]);
    const [showImage, setShowImage] = useState(null);

    const [loading, setLoading] = useState(true);

    const fetchRequest = async () => {
        try {
            setLoading(true);

            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/roleUpgradeRequest`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setrequests(res.data.requests || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {


        fetchRequest();

        if (loading) {
  return (
    <>
      <Header2 />
      <h2>Loading...</h2>
    </>
  );
}
    }, [token]);

    const handleconfirm = async (upgradeTo, emailid, requestid) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/updateuserrole`,
                {
                    upgradeTo,
                    emailid,
                    requestid,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            fetchRequest();
        } catch (err) {
            console.error(err);
            alert("Failed to confirm request.");
        }
    };

    const handlereject = async (requestid) => {

        await axios.post(
            `${import.meta.env.VITE_API_URL}/rejectuserroleupgraderequest`, {
            requestid
        },
            // empty body
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        fetchRequest();
    }


    return (
        <div id='requestbox'>
            <Header2 />
            <div id='box2Request'>
                {Array.isArray(requests) &&
                    requests.filter((request) => request.requestStatus === "pending").length > 0 ? (
                    requests
                        .filter((request) => request.requestStatus === "pending")
                        .map((request) => (
                            <div key={request._id} className='box3request'>
                                <div id='info'>
                                    Email :- {request.email} <br />
                                    PhoneNo :- {request.phoneNo} <br />
                                    Country :- {request.country} <br />
                                    State :- {request.state} <br />
                                    District :- {request.district} <br />
                                    Pincode :- {request.pincode} <br />
                                    Request For :- {request.requestof} <br />
                                    UPI Id :- {request.upiId} <br />

                                    <button onClick={() => setShowImage(request.aadhaarImage)}>
                                        Aadhaar Card
                                    </button>

                                    <button onClick={() => setShowImage(request.panImage)}>
                                        PAN Card
                                    </button>
                                </div>

                                <div>
                                    <a style={{ height: "90%" }} href={`tel:${request.phoneNo}`}>
                                        <button>Call</button>
                                    </a>

                                    <button onClick={() => handleconfirm(request.requestof, request.email, request._id)}>
                                        Confirm
                                    </button>

                                    <button onClick={() => handlereject(request._id)}>
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))
                ) : (
                    <p>No Pending Requests</p>
                )}
            </div>

            {showImage && (
                <div id='imgdiv'>
                    <img
                        src={showImage}
                        alt="Aadhar Card"
                        style={{
                            width: "400px",
                            height: "auto",
                            border: "1px solid black"
                        }}
                    />

                    <button onClick={() => setShowImage(null)}>
                        Close
                    </button>
                </div>
            )}
        </div>

    )
}

export default Request