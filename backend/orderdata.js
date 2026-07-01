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

    items: [
        {
            productid: { type: String, required: true },
            productname: { type: String, required: true },
            quantity: { type: Number, required: true },
            sellerid: { type: String, required: true },
            price: { type: Number }
        }
    ],

    delivery_partner: { type: String },

    delivery_partner_verification: {
        type: String,
        default: 'Not Verified'
    },

    customercorrdinates: {
        latitude: { type: Number },
        longitude: { type: Number }
    },

    shopcorrdinates: {
        latitude: { type: Number },
        longitude: { type: Number }
    },


    orderstatus: {
        type: String,
        default: "Pending"
    },

    // 🚚 SHIPPING FIELDS
    shipment_id: { type: String },
    awb_code: { type: String },
    courier_name: { type: String },
    tracking_url: { type: String },

    seller_key: { type: String },

    payment_method: {
        type: String,
        default: "COD"
    },
    paymeentStatus: { type: String },
    paymentId: { type: String },

    weight: {
        type: Number,
    },
    order_date: {
        type: Date,
        default: Date.now
    },
    order_time: {
        type: String,
        default: new Date().toLocaleTimeString()
    }
});

module.exports = mongoose.model("orderdata", orderSchema);