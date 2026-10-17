import React from 'react'
import './Loderpage.css'

// Full-page loader. Pass inline to size it for a section under the header,
// and message to say what is loading.
const Loaderpage = ({ message = 'Loading…', inline = false }) => {
    return (
        <div className={inline ? 'ld-wrap ld-inline' : 'ld-wrap'} role="status" aria-live="polite">
            <div className="ld-mark">
                <span className="ld-ring" aria-hidden="true" />
                <img className="ld-logo" src="/E.png" alt="" />
            </div>
            <p className="ld-text">{message}</p>
        </div>
    )
}

export default Loaderpage
