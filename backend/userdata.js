const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  role:{
    type:String
  },
  name: {
    type: String,
    required: true
  }, dob: {
    type: Date,
    required: true
  }, gender: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  pass: {
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
}
});

module.exports = mongoose.model("userdata", userSchema);