const mongoose = require("mongoose");
const { request } = require("node:http");

const requestSchema = new mongoose.Schema({
    role: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
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
    pickup_location: {
        type: String
    },
    requestof: {
        type: String
    }
});

module.exports = mongoose.model("requestdata", requestSchema);