const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateFetchRequestForStaff(data) {
  let errors = {};

  // Convert empty s to an empty string so we can use validator functions
  data.code = !isEmpty(data.code) ? data.code : "";
  data.closed = !isEmpty(data.closed) ? data.closed : "";

  if (Validator.isEmpty(data.code) || Validator.isEmpty(data.closed)) {
    errors.error = "Error. Refresh the page.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
