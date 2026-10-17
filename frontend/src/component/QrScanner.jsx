import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef } from "react";

const QrScanner = ({ onScan }) => {
  const scannerRef = useRef(null);

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
              onScan(text);

              if (qr.isScanning) {
                qr.stop().catch(()=>{});
              }
            },
            () => {}
          );
        }

      } catch(err) {
        console.log("Camera error:", err);
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

  }, [onScan]);


  return (
    <div
      id="reader"
      style={{
        width:"100%",
        maxWidth:"400px",
        height:"400px",
        margin:"auto"
      }}
    />
  );
};

export default QrScanner;