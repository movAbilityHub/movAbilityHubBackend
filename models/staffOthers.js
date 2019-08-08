const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const staffOthersSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  organisationName: {
    type: String,
    required: true
  },
  organisationType: {
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
  code: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    requred: true,
    enum: ["airline", "airport", "travelAgency"]
  },
  appliedOn: {
    type: Date,
    default: Date.now
  },
  approvedOn: {
    type: Date,
    required: false
  },
  approvedBy: {
    type: String,
    required: false
  }
});

module.exports = StaffOthers = mongoose.model("staffOthers", staffOthersSchema);
