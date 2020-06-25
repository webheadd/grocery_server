const mongoose = require("mongoose");

const customerSchema = mongoose.Schema({
  customerID: {
    type: String,
    userCreateIndex: true,
    required: true
  },
  mobile: {
    type: Number,
    userCreateIndex: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Customer", customerSchema);
