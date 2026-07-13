const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    username: String,
    useremail: String,

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
        enum: ["Pending", "Approved", "Rejected", "Completed", "Expired"],
        default: "Pending"
    },

    paymentDetails: {
        upiId: String,
        bankAccount: String,
        ifsc: String
    },

    expiryDate: {
        type: Date,
        expires: 0
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Withdrawal", withdrawalSchema);