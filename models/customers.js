const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const customerSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: Number,
    required: true
  },
  countryCode: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    default: "customer"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Customer = mongoose.model("Customer", customerSchema);
