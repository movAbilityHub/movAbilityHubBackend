const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const staffOthersSchema = new Schema({
  organisationName: {
    type: String,
    required: true
  },
  userType: {
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
  approved: {
    type: Boolean,
    default: false
  },
  approvedOn: {
    type: Date,
    required: false
  },
  approvedBy: {
    type: String,
    required: false
  },
  staffID: {
    type: String,
    required: false
  },
});

module.exports = StaffOthers = mongoose.model("staffOthers", staffOthersSchema);
