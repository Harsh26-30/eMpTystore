import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './Key.css'
import axios from 'axios';
import Header2 from './header2';


const Key = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate()
    const [msg, setmsg] = useState('')
    const [userRole, setuserRole] = useState('')
    const [msgVisible, setmsgVisible] = useState(false)
    const [status,setstatus] = useState()

    const fun1 = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/checkuserinfo`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setuserRole(res.data.role);

            const res2 = await axios.get(
                `${import.meta.env.VITE_API_URL}/checkrequeststatus`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setmsg(res2.data.msg);
            setmsgVisible(res2.data.success);
            setstatus(res2.data.requestStatus)

        } catch (err) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        if (!token) return;

        fun1();
    }, [token]);


    return (
        <div id='mainboxkey'>
            <Header2 />
            {msgVisible === true && (
                <div style={{backgroundColor:status === 'Confirm'? "#56e34f66":"#ed1b2278"}} id='msgbox'>
                    <p>{msg}</p>
                </div>
            )}

            <div id='userCurrentRole'>
                <h3>Your Current Role: {userRole}</h3>
            </div>

            {userRole === 'Customer' && (
                <div id='boxrequestkey'>
                    <h3>Request to be Seller</h3>
                    <button onClick={() => {
                        navigate("/requestform", {
                            state: {
                                requestof: "Seller"
                            }
                        })
                    }}>
                        Make Request
                    </button>
                </div>
            )}

            {userRole === 'Customer' && (

                <div id='boxrequestkey'>
                    <h3>Request to be Delivery Partner</h3>
                        <button onClick={() => {
                        navigate("/requestform", {
                               state: {
                                requestof: "Delivery_partner"
                            }
                        })
                    }}>
                        Make Request
                    </button>
                </div>
            )}


        </div>
    )
}

export default Key