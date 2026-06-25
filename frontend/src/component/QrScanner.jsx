import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useRef } from "react";

const QrScanner = ({ onScan }) => {
  const scannedRef = useRef(false);
  const scannerRef = useRef(null);

  useEffect(() => {
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
      (error) => {
        // ignore scanning errors
      }
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, []); // 👈 IMPORTANT: empty dependency

  return <div id="reader" />;
};

export default QrScanner;