const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateStoreRequest(data) {
  let errors = {};

  // Convert empty s to an empty string so we can use validator functions
  data.passportNumber = !isEmpty(data.passportNumber)
    ? data.passportNumber
    : "";
  data.ticketNumber = !isEmpty(data.ticketNumber) ? data.ticketNumber : "";
  data.travelDate = !isEmpty(data.travelDate) ? data.travelDate : "";
  data.travelTime = !isEmpty(data.travelTime) ? data.travelTime : "";
  data.flightNumber = !isEmpty(data.flightNumber) ? data.flightNumber : "";
  data.origin = !isEmpty(data.origin) ? data.origin : "";
  data.destination = !isEmpty(data.destination) ? data.destination : "";
  data.requestedBy = !isEmpty(data.requestedBy) ? data.requestedBy : "";
  data.requesterID = !isEmpty(data.requesterID) ? data.requesterID : "";
  data.disability = !isEmpty(data.disability) ? data.disability : "";
  data.age = !isEmpty(data.age) ? data.age : "";
  data.service = !isEmpty(data.service) ? data.service : "";
  data.requestedFor = !isEmpty(data.requestedFor) ? data.requestedFor : "";
  data.phoneNumber = !isEmpty(data.phoneNumber) ? data.phoneNumber : "";
  data.originCode = !isEmpty(data.originCode) ? data.originCode : "";
  data.destinationCode = !isEmpty(data.destinationCode)
    ? data.destinationCode
    : "";
  data.airline = !isEmpty(data.airline) ? data.airline : "";
  data.airlineCode = !isEmpty(data.airlineCode) ? data.airlineCode : "";

  if (Validator.isEmpty(data.passportNumber)) {
    errors.passportNumber = "Passport Number is required";
  }

  if (Validator.isEmpty(data.ticketNumber)) {
    errors.ticketNumber = "Ticket Number is required";
  }

  if (Validator.isEmpty(data.travelDate)) {
    errors.travelDate = "Travel Date is required";
  }

  if (Validator.isEmpty(data.travelTime)) {
    errors.travelTime = "Travel Time is required";
  }

  if (Validator.isEmpty(data.flightNumber)) {
    errors.flightNumber = "Flight Number is required";
  }

  if (Validator.isEmpty(data.origin)) {
    errors.origin = "Origin is required";
  }

  if (Validator.isEmpty(data.destination)) {
    errors.destination = "Destination is required";
  }

  if (Validator.isEmpty(data.requestedBy)) {
    errors.requestedBy = "Error. Try again";
  }

  if (Validator.isEmpty(data.requesterID)) {
    errors.requesterID = "Error. Try again";
  }

  if (Validator.isEmpty(data.disability)) {
    errors.disability = "Disability is required";
  }

  if (Validator.isEmpty(data.age)) {
    errors.age = "Age is required";
  }

  if (Validator.isEmpty(data.service)) {
    errors.service = "Service is required";
  }

  if (Validator.isEmpty(data.requestedFor)) {
    errors.requestedFor = "Requested for is required";
  }

  if (Validator.isEmpty(data.phoneNumber)) {
    errors.phoneNumber = "Phone number is required";
  }

  if (!Validator.isEmpty(data.phoneNumber)) {
    if (!data.phoneNumber.isValid) {
      errors.phoneNumberIsValid = "Enter a valid phone number";
    }
    if (!data.phoneNumber.isMobile) {
      errors.phoneNumberIsMobile = "The entered number isn't a mobile number";
    }
  }

  if (Validator.isEmpty(data.originCode)) {
    errors.originCode = "Error, Try Again";
  }

  if (Validator.isEmpty(data.destinationCode)) {
    errors.destinationCode = "Error, Try Again";
  }

  if (Validator.isEmpty(data.airline)) {
    errors.airline = "Airline is required";
  }

  if (Validator.isEmpty(data.airlineCode)) {
    errors.airlineCode = "Error, Try Again";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
