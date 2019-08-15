const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateViewClosedRequest(data) {
  let errors = {};

  // Convert empty s to an empty string so we can use validator functions
  data.requesterID = !isEmpty(data.requesterID) ? data.requesterID : "";
  data.closed = !isEmpty(data.closed) ? data.closed : "";

  if (Validator.isEmpty(data.requesterID)) {
    errors.error = "Error. Refresh the page.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
