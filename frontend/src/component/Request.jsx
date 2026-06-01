import React from 'react'
import './Request.css'
import Header2 from './header2'
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';

const Request = () => {
    const token = localStorage.getItem("token");
    const [requests, setrequests] = useState([]);
    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/Request`,
                    // empty body
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setrequests(res.data.requests);

            } catch (err) {
                console.error(err);
            }
        };

        fetchRequest();
    }, [token]);

    return (




        <div id='requestbox'>
            <Header2 />
            <div id='box2Request'>

                {Array.isArray(requests) && requests.length > 0 ? (
                    requests.map((request) => (
                        <div key={request._id} className='box3request' >
                            { (<p>
                                Current_Role :- {request.role} <br />
                                Email :-  {request.email} <br />
                                seller_key :- {request.seller_key}<br />
                                PhoneNo :- {request.phoneNo} <br />
                                Country :- {request.country} <br />
                                State. :-  {request.state} <br />
                                District :- {request.district} <br />
                                Pincode :- {request.pincode} <br />
                                Address :- {request.address} <br />
                                requestof :-  {request.requestof}
                            </p>)}
                            {request.requeststatus === 'pending' ?
                                <button onClick={() => handleconfirm(request._id)}>Confirm</button> :
                                <></>}
                            <div>
                                {request.requeststatus === 'Confirm' && request.requeststatus === visible ?
                                    <button onClick={() => handlereadyforshipment(request._id)}>Ready for Shipment</button> :
                                    <></>}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No Request found</p>
                )}        </div>
        </div>

    )
}

export default Request