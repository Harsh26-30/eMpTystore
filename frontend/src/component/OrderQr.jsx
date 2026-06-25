import QRCode from "react-qr-code";

function OrderQr() {
  return (
    <div>
      <QRCode value="Hello World" size={200} />
    </div>
  );
}

export default OrderQr;