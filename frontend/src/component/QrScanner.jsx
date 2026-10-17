import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import "./QrScanner.css";

const QrScanner = ({ onScan }) => {
  const scannerRef = useRef(null);
  const onScanRef = useRef(onScan);
  const [cameraError, setCameraError] = useState("");

  // Always call the latest handler without restarting the camera on every render.
  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    let isMounted = true;

    const startCamera = async () => {
      try {
        // wait until DOM renders
        await new Promise(resolve => setTimeout(resolve, 500));

        if (!document.getElementById("reader")) {
          console.log("reader div missing");
          return;
        }

        const qr = new Html5Qrcode("reader");
        scannerRef.current = qr;

        const devices = await Html5Qrcode.getCameras();

        if (!devices.length) {
          console.log("No camera found");
          if (isMounted) setCameraError("No camera found on this device.");
          return;
        }

        const cameraId = devices[0].id;

        if (isMounted) {
          await qr.start(
            cameraId,
            {
              fps: 10,
              qrbox: {
                width: 250,
                height: 250
              }
            },
            (text) => {
              console.log("SCAN:", text);
              onScanRef.current(text);

              if (qr.isScanning) {
                qr.stop().catch(()=>{});
              }
            },
            () => {}
          );
        }

      } catch(err) {
        console.log("Camera error:", err);
        if (isMounted) setCameraError("We could not open the camera. Allow camera access in your browser settings, then try again.");
      }
    };


    startCamera();


    return () => {
      isMounted = false;

      const qr = scannerRef.current;

      if (qr && qr.isScanning) {
        qr.stop()
          .then(() => qr.clear())
          .catch(()=>{});
      }
    };

  }, []);


  return (
    <div className="qs-wrap">
      <div id="reader" className="qs-reader" />
      {cameraError
        ? <p className="alert alert-error" role="alert">{cameraError}</p>
        : <p className="qs-hint">Point the camera at the QR code.</p>}
    </div>
  );
};

export default QrScanner;
