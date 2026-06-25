import { QRCodeCanvas } from "qrcode.react";

const OrderQr = ({ value }) => {
  return <QRCodeCanvas value={value} size={150} />;
};

export default OrderQr;