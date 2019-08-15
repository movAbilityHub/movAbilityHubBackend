const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const staffIATASchema = new Schema({
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
  password: {
    type: String,
    required: true
  },
  staffID: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    default: "iataStaff"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = StaffIATA = mongoose.model("staffIATA", staffIATASchema);
