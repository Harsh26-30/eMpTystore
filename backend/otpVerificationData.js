const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "pending"
    },
    expiresAt: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("OTPData", OTPSchema);