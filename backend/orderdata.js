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

    delivery_partner: { type: String },

    delivery_partner_verification:{
         type :String,
         default:'Not Verified'
        },

    customercorrdinates: {
        latitude: { type: String },
        longitude: { type: String }
    },
    
    shopcorrdinates: {
        latitude: { type: String },
        longitude: { type: String }
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