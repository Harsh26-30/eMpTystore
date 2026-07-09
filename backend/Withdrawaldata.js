const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    username: {
        type: String
    },
    useremail: {
        type: String
    },
    role: {
        type: String,
        enum: ["Seller", "Delivery_partner"],
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected", "Completed"],
        default: "Pending"
    },

    paymentDetails: {
        upiId: String,
        bankAccount: String,
        ifsc: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model("Withdrawal", withdrawalSchema);