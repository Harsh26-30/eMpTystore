import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useRef } from "react";

const QrScanner = ({ onScan }) => {
  const scannedRef = useRef(false);
  const scannerRef = useRef(null);

useEffect(() => {
  const requestCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      console.log("Permission granted", stream);

      stream.getTracks().forEach((track) => track.stop());
    } catch (err) {
      console.log("Permission denied or error:", err);
    }
  };

  requestCamera(); // ✅ THIS WAS MISSING

  const scanner = new Html5QrcodeScanner(
    "reader",
    {
      fps: 10,
      qrbox: 250,
      rememberLastUsedCamera: true,
    },
    false
  );

  scannerRef.current = scanner;

  scanner.render(
    (decodedText) => {
      if (scannedRef.current) return;

      scannedRef.current = true;

      onScan(decodedText);

      scanner.clear().catch(() => {});
    },
    (error) => {}
  );

  return () => {
    scannerRef.current?.clear().catch(() => {});
    scannerRef.current = null;
  };
}, []);

  return <div id="reader" />;
};

export default QrScanner;