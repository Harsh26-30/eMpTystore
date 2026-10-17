import React, { useState } from 'react'
import './uploadcomponent.css';
import axios from 'axios';

const uploadcomponent = () => {
    const token = localStorage.getItem("token");

    const [Componentid, setComponentid] = useState('');
    const [Componentcode, setComponentcode] = useState('');
    const [msg, setmsg] = useState('');


    const handlesubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/uploadui`,
                { Componentid, Componentcode },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setmsg(res.data.message || "Uploaded successfully");

        } catch (err) {
            console.log(err);

        }
    }
    return (
        <div id='mainboxuploadcomponent'>
            <div id='box2uploadcomponent'>
                <form onSubmit={handlesubmit}>
                    <fieldset>
                        <legend>Component id</legend>
                        <input onChange={(e) => { setComponentid(e.target.value) }} type="text" />
                    </fieldset>
                    <fieldset>
                        <legend>Component Code</legend>
                        <textarea onChange={(e) => { setComponentcode(e.target.value) }} id="codeinput"></textarea>
                    </fieldset>
                    <button type='submit'>Upload</button>
                </form>
                <p>{msg}</p>
            </div>
        </div>
    )
}

export default uploadcomponent
