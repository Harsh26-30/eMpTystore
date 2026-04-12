import React from 'react'
import './footer.css'
import { useNavigate } from "react-router-dom";

const footer = () => {
    const navigate = useNavigate();

    return (

        <div id='mainboxfooter'>
            <button onClick={(e)=>{navigate("/uploadproduct");}}>
                <img src="\add_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png" alt="add product" />
            </button>
            <button onClick={(e)=>{navigate("/searchbox");}}>
                <img src="\search_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png" alt="Search" />
            </button>
        </div>

    )
}

export default footer
