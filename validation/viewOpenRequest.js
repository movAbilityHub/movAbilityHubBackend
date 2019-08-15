const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateViewOpenRequest(data) {
  let errors = {};

  // Convert empty s to an empty string so we can use validator functions
  data.requesterID = !isEmpty(data.requesterID) ? data.requesterID : "";
  data.status = !isEmpty(data.status) ? data.status : "";

  if (Validator.isEmpty(data.requesterID)) {
    errors.error = "Error. Refresh the page.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
