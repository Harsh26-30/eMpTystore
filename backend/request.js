const mongoose = require("mongoose");

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
    seller_key: {
        type: String
    },
    requestof: {
        type: String
    },

    requestStatus: {
        type: String,
        default: "pending"
    },

    // MongoDB will delete after this date
    deleteAt: {
        type: Date
    },

    aadhaarImage: {
        type: String
    },
    panImage: {
        type: String
    },
    upiId: {
        type: String
    }

}, {
    timestamps: true
});


// TTL index
requestSchema.index(
    { deleteAt: 1 },
    { expireAfterSeconds: 0 }
);


module.exports = mongoose.model("requestdata", requestSchema);