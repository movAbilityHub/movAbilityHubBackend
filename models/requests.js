const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const db = require("../config/mongoKey").mongoURI;

const connection = mongoose.createConnection(db);
autoIncrement.initialize(connection, { useNewUrlParser: true });
console.log("Autoincrement connection established");

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
  requestDescription: {
    type: String,
    required: true
  }
});

requestSchema.plugin(autoIncrement.plugin, {
  model: "Request",
  field: "id"
});

module.exports = Request = mongoose.model("Request", requestSchema);
