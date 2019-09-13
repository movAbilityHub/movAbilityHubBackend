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
  travelDate: {
    type: String,
    required: true
  },
  travelTime: {
    type: Number,
    required: false
  },
  flightNumber: {
    type: String,
    required: true
  },
  airline: {
    type: String,
    required: true
  },
  airlineCode: {
    type: String,
    required: true
  },
  origin: {
    type: String,
    required: true
  },
  originCode: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  destinationCode: {
    type: String,
    required: true
  },
  transitDestination: {
    type: [String],
    required: false
  },
  transitDestinationCode: {
    type: [String],
    required: false
  },
  transitAirline: {
    type: [String],
    required: false
  },
  transitAirlineCode: {
    type: [String],
    required: false
  },
  status: {
    type: Boolean,
    default: true
  },
  airlineResponse: {
    type: String,
    default: "null"
  },
  airportResponse: {
    type: String,
    default: "null"
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
    type: String,
    required: true
  },
  phoneNumber: {
    type: Number,
    required: true
  },
  disability: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  service: {
    type: String,
    required: true
  },
  closedByAirline: {
    type: Boolean,
    default: false
  },
  closedByDepartureAirport: {
    type: Boolean,
    default: false
  },
  closedByDestinationAirport: {
    type: Boolean,
    default: false
  }
});

requestSchema.plugin(autoIncrement.plugin, {
  model: "Request",
  field: "id"
});

module.exports = Request = mongoose.model("Request", requestSchema);
