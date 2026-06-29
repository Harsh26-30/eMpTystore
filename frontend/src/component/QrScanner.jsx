import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef } from "react";

const QrScanner = ({ onScan }) => {
  const scannerRef = useRef(null);
  const scannedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const startCamera = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();

        if (!devices || devices.length === 0) {
          console.log("No cameras found");
          return;
        }

        let backCamera =
          devices.find(
            (d) =>
              d.label.toLowerCase().includes("back") ||
              d.label.toLowerCase().includes("rear") ||
              d.label.toLowerCase().includes("environment")
          ) || devices[devices.length - 1];

        const qr = new Html5Qrcode("reader");
        scannerRef.current = qr;

        await qr.start(
          backCamera.id,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          async (decodedText) => {
            if (scannedRef.current) return;

            scannedRef.current = true;

            console.log("SCAN:", decodedText);

            try {
              await onScan(decodedText);
            } catch (err) {
              console.error(err);
            }

            try {
              if (scannerRef.current?.isScanning) {
                await scannerRef.current.stop();
              }
            } catch (e) {
              console.log(e);
            }
          },
          () => {}
        );
      } catch (err) {
        console.log("Camera error:", err);
      }
    };

    if (isMounted) {
      startCamera();
    }

    return () => {
      isMounted = false;

      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => scannerRef.current.clear())
          .catch(() => {});
      }
    };
  }, [onScan]);

  return (
    <div
      id="reader"
      style={{
        width: "100%",
        maxWidth: "400px",
        height: "400px",
        margin: "auto",
        background: "#000",
      }}
    />
  );
};

export default QrScanner;