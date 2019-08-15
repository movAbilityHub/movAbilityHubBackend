const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const db = require("../config/mongoKey").mongoURI;

const connection = mongoose.createConnection(db);
autoIncrement.initialize(connection, { useNewUrlParser: true });

const Schema = mongoose.Schema;

// Create Schema
const careReceiverSchema = new Schema({
  correspondantID: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  telephone: {
    type: String,
    required: false
  },
  mobile: {
    type: String,
    required: true
  },
  disabilities: {
    type: [String],
    required: true
  },
  supportNeeded: {
    type: [String],
    required: true
  },
  additionalRemarks: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

careReceiverSchema.plugin(autoIncrement.plugin, {
  model: "PassengerInfo",
  field: "id"
});

module.exports = CareReceiver = mongoose.model(
  "careReceiver",
  careReceiverSchema
);
