const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateCancelRequest(data) {
  let errors = {};

  // Convert empty s to an empty string so we can use validator functions
  data.id = !isEmpty(data.id) ? data.id : "";

  if (Validator.isEmpty(data.id)) {
    errors.error = "Error. Try again.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
