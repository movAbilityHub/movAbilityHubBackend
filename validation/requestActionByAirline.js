const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRequestActionByAirline(data) {
  let errors = {};

  // Convert empty s to an empty string so we can use validator functions
  data.id = !isEmpty(data.id) ? data.id : "";
  data.airlineResponse = !isEmpty(data.airlineResponse)
    ? data.airlineResponse
    : "";

  if (Validator.isEmpty(data.id) || Validator.isEmpty(data.airlineResponse)) {
    errors.id = "Action could not be perfomed. Try again.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
