const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const db = require("../config/mongoKey").mongoURI;

const connection = mongoose.createConnection(db);
autoIncrement.initialize(connection, { useNewUrlParser: true });

const Schema = mongoose.Schema;

// Create Schema
const requestSchema = new Schema({
  passportNumber: {
    type: String,
    required: true
  },
  ticketNumber: {
    type: String,
    required: true
  },
  flightNumber: {
    type: String,
    required: true
  },
  origin: {
    type: String,
    required: true
  },
  originTerminalNumber: {
    type: String,
    required: false
  },
  destination: {
    type: String,
    required: true
  },
  destinationTerminalNumber: {
    type: String,
    required: false
  },
  transitDestination: {
    type: [String],
    required: false
  },
  transitDestinationTerminalNumber: {
    type: [String],
    required: false
  },
  status: {
    type: Boolean,
    default: null
  },
  acceptedBy: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  requestedBy: {
    type: String,
    required: true
  },
  requesterID: {
    type: String,
    required: true
  },
  requestedFor: {
    type: Number,
    required: true
  }
});

requestSchema.plugin(autoIncrement.plugin, {
  model: "Request",
  field: "id"
});

module.exports = Request = mongoose.model("Request", requestSchema);
