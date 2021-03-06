const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const travelAgentsSchema = new Schema({
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
  agencyCode: {
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
  userType: {
    type: String,
    default: "travelAgent"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = TravelAgents = mongoose.model(
  "travelAgents",
  travelAgentsSchema
);
