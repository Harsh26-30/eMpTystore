import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useRef } from "react";

const QrScanner = ({ onScan }) => {
  const scannedRef = useRef(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    scanner.render(
      async (decodedText) => {
        if (scannedRef.current) return;

        scannedRef.current = true;

        onScan(decodedText);

        try {
          await scanner.clear();
        } catch (err) {
          console.log(err);
        }
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [onScan]);

  return <div id="reader"></div>;
};

export default QrScanner;