import React from 'react'
import './Loderpage.css'

const Loaderpage = () => {
    return (
        <div
            style={{
                width: "100%",
                height: "100vh",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                flexDirection: "column",
            }}
        >
            {/* Rotating layer */}
            <div style={{
                width: "280px",
                height: "180px",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "10%",
            }}>
                <div
                    style={{
                        width: "300px",
                        height: "400px",
                        borderRadius: "10%",
                        background: "linear-gradient(0deg, black, white)",
                        animation: "spin 1s linear infinite",
                        position: "absolute",
                        padding: "10px",
                    }}
                />

                {/* Fixed center layer */}
                <div
                    style={{
                        width: "270px",
                        height: "170px",
                        borderRadius: "10%",
                        backgroundColor: "#fff",
                        position: "absolute",
                        zIndex: 1,

                    }}
                >
                    <img src="E.png" alt="Logo" style={{ width: "100%", height: "100%", borderRadius: "10%" }} />
                </div>
            </div>
            <h3 style={{ marginTop: "10px", fontFamily: "Arial, sans-serif", color: "grey" }}>Loading...</h3>

        </div>
    )
}

export default Loaderpage