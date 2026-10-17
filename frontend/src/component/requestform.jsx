import React,{useState} from "react";
import "./requestform.css";
import { useLocation,useNavigate } from "react-router-dom";
import Header2 from "./header2";
import axios from 'axios'

const RequestForm = () => {
    const token = localStorage.getItem("token");

    const location = useLocation();

    const navigate = useNavigate()

    const requestof = location.state?.requestof || "Request";

    const [aadhaar, setAadhaar] = useState(null);
    const [pan, setPan] = useState(null);
    const [upiId, setUpiId] = useState("");

   const handlerequestkey = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("upgradeTo", requestof);
    formData.append("aadhaar", aadhaar);
    formData.append("pan", pan);
    formData.append("upiId", upiId);

    try {
        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/requestupdateuserrole`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        alert(res.data.msg);

        navigate(-1)

    } catch (err) {
        console.log(err.response?.data || err.message);
    }
};


    return (
        <div id="mainboxrequestform">

            <Header2 />

            <h3>
                Request form for {requestof}
            </h3>
            <div id="forminput">

                <form>
                    <label>Adhar Card</label>
                    <input required
                        type="file"
                        onChange={(e) => setAadhaar(e.target.files[0])}
                    />
                    <label >Pan card</label>
                    <input required
                        type="file"
                        onChange={(e) => setPan(e.target.files[0])}
                    />                    <label>Upi iD</label>
                    <input required
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                    />                </form>

                <button onClick={handlerequestkey}> Submit </button>
            </div>


        </div>
    );
};

export default RequestForm;