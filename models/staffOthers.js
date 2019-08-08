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
    required: true,
    enum: ["airline", "airport", "travelAgency"]
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
