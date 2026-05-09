const mongoose = require("mongoose");
const { type } = require("node:os");
const { Script } = require("node:vm");

const userSchema = new mongoose.Schema({
  role: {
    type: String
  },
  name: {
    type: String,
  }, dob: {
    type: Date,
  }, gender: {
    type: String,
  },
  email: {
    type: String,
    unique: true
  },
  pass: {
    type: String,
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
  pickup_location: {
    type: String
  },
  myproductid: {
    type: [String]
  },
  customer: {
    type: [String]
  },
  shoporseller: {
    type: [String]
  },
  ui: {
    generalinfo: {
      logo: { type: String },
      BusinessName: { type: String },
      Color:{types:String}
    },
    componentid: {
      header: { type: String },
      body: { type: String },
      footer: { type: String }
    },
    productbox: {
      productbox1id: { type: String },
      productbox2id: { type: String },
      productbox3id: { type: String },
      productbox4id: { type: String },
      productbox5id: { type: String },
      productbox6id: { type: String },
      productbox7id: { type: String },
      productbox8id: { type: String },
      productbox9id: { type: String },
      productbox10id: { type: String },
      productbox11id: { type: String },
      productbox12id: { type: String },
    }
  }
});

module.exports = mongoose.model("userdata", userSchema);