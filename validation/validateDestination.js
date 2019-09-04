const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateDestination(data) {
  let errors = {};

  // Convert empty s to an empty string so we can use validator functions
  data.destination = !isEmpty(data.destination) ? data.destination : "";

  if (Validator.isEmpty(data.destination)) {
    errors.destination = "Set destination.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
