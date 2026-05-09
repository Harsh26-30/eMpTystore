const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productimage: {
        type: String,
        required: true
    },
    productname: {
        type: String,
        required: true
    }, productcategory: {
        type: String,
        required: true,
    },
    productcolor: {
        type: String,
        required: true,
    }, productprice: {
        type: String,
        required: true,
    }, productsellername: {
        type: String,
        required: true,
    }, productsellerid: {
        type: String,
        required: true,
    }, productextrainfo: {
        type: String,
        required: true,
    },
    totalstock:{
        type:Number
    },
    unitsold:{
        type:Number
    }
});

module.exports = mongoose.model("productdata", productSchema);