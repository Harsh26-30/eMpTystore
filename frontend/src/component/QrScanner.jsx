import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef } from "react";

const QrScanner = ({ onScan }) => {
    const scannerRef = useRef(null);

    useEffect(() => {
        const qr = new Html5Qrcode("reader");
        scannerRef.current = qr;

        const start = async () => {
            try {
                const devices = await Html5Qrcode.getCameras();

                if (devices && devices.length) {
                    await qr.start(
                        devices[0].id,
                        {
                            fps: 10,
                            qrbox: { width: 250, height: 250 },
                        },
                        (text) => {
                            console.log("SCAN:", text);
                            onScan(text);
                            qr.stop();
                        }
                    );
                }
            } catch (e) {
                console.log("START ERROR:", e);
            }
        };

        start();

        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(() => { });
            }
        };
    }, []);

    return (
        <div
            id="reader"
            style={{
                width: "100%",
                maxWidth: "400px",
                height: "400px",
                margin: "auto",
                background: "black",
            }}
        />
    );
};

export default QrScanner;