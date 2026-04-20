const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customerid: { type: String, required: true },
    customername: { type: String, required: true },
    customeremail: { type: String, required: true },

    phoneNo: { type: String },
    country: { type: String },
    state: { type: String },
    district: { type: String },
    address: { type: String },
    pincode: { type: String },

    productname: { type: String },
    productid: { type: String },
    quantity: { type: Number },

    sellerid: { type: String, required: true },

    orderstatus: {
        type: String,
        default: "Pending"
    },

    // 🚚 SHIPPING FIELDS
    shipment_id: { type: String },
    awb_code: { type: String },
    courier_name: { type: String },
    tracking_url: { type: String },

    pickup_location: { type: String },

    payment_method: {
        type: String,
        default: "Prepaid"
    },

    weight: {
        type: Number,
        default: 0.5
    }
});

module.exports = mongoose.model("orderdata", orderSchema);