const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customerid: {
        type: String,
        required: true
    },
    customername: {
        type: String,
        required: true
    },
    customeremail: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
    },
    country: {
        type: String,
    },
    state: {
        type: String,
    },
    district: {
        type: String,
    },
    address: {
        type: String
    },
    pincode: {
        type: String
    },
    quantity: {
        type: Number
    },
    sellerid: {
        type: String,
        required: true
    },
    orderstatus: {
        type: String
    }
});

module.exports = mongoose.model("orderdata", orderSchema);