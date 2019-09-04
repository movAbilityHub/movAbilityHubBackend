const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateDeparture(data) {
  let errors = {};

  // Convert empty s to an empty string so we can use validator functions
  data.departure = !isEmpty(data.departure) ? data.departure : "";

  if (Validator.isEmpty(data.departure)) {
    errors.departure = "Set departure.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
