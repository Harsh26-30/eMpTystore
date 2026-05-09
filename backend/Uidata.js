const mongoose = require("mongoose");

const UiSchema = new mongoose.Schema({
    Componentid: {
        type: String,
        required: true
    },
    Componentcode: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Uidata", UiSchema);