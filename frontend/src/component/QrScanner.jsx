import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef } from "react";

const QrScanner = ({ onScan }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    const qr = new Html5Qrcode("reader");
    scannerRef.current = qr;

    const startCamera = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();

        if (!devices || devices.length === 0) {
          console.log("No cameras found");
          return;
        }

        // 🔥 Try to find BACK camera
        let backCamera = devices.find((d) =>
          d.label.toLowerCase().includes("back") ||
          d.label.toLowerCase().includes("rear") ||
          d.label.toLowerCase().includes("environment")
        );

        // fallback if not found
        if (!backCamera) {
          backCamera = devices[devices.length - 1];
        }

        await qr.start(
          backCamera.id,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          async (text) => {
            console.log("SCAN:", text);

            await qr.stop();
            await qr.clear();

            await onScan(text);
          },
          () => { }
        );
      } catch (err) {
        console.log("Camera error:", err);
      }
    };

    startCamera();

    return () => {
      qr.stop()
        .then(() => qr.clear())
        .catch(() => { });
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