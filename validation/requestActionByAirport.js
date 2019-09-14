const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRequestActionByAirport(data) {
  let errors = {};

  // Convert empty s to an empty string so we can use validator functions
  data.id = !isEmpty(data.id) ? data.id : "";
  data.airportResponse = !isEmpty(data.airportResponse)
    ? data.airportResponse
    : "";
  data.responseBy = !isEmpty(data.responseBy) ? data.responseBy : "";

  if (
    Validator.isEmpty(data.id) ||
    Validator.isEmpty(data.airportResponse) ||
    Validator.isEmpty(data.responseBy)
  ) {
    errors.id = "Action could not be perfomed. Try again.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
