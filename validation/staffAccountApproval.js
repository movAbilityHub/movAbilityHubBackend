const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateAccountApproval(data) {
  let errors = {};

  // Convert empty s to an empty string so we can use validator functions
  data.id = !isEmpty(data.id) ? data.id : "";
  data.name = !isEmpty(data.name) ? data.name : "";

  if (Validator.isEmpty(data.id) || Validator.isEmpty(data.name)) {
    errors.error = "Error. Try again.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
