import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef } from "react";

const QrScanner = ({ onScan }) => {
  const qrRef = useRef(null);
  const scannedRef = useRef(false);

  useEffect(() => {
    const qr = new Html5Qrcode("reader");
    qrRef.current = qr;

    const start = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();

        if (!devices.length) return;

        let camera =
          devices.find(
            d =>
              d.label.toLowerCase().includes("back") ||
              d.label.toLowerCase().includes("rear") ||
              d.label.toLowerCase().includes("environment")
          ) || devices[devices.length - 1];

        await qr.start(
          camera.id,
          {
            fps: 10,
            qrbox: 250,
          },
          async (decodedText) => {
            if (scannedRef.current) return;
            scannedRef.current = true;

            // Stop scanning FIRST
            try {
              await qr.pause(true);
            } catch {}

            // Let parent handle everything
            await onScan(decodedText);
          },
          () => {}
        );
      } catch (e) {
        console.log(e);
      }
    };

    start();

    return () => {
      if (qrRef.current) {
        qrRef.current
          .stop()
          .then(() => qrRef.current.clear())
          .catch(() => {});
      }
    };
  }, []);

  return (
    <div
      id="reader"
      style={{
        width: "350px",
        height: "350px",
      }}
    />
  );
};

export default QrScanner;