const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateChatInput(data) {
  let errors = {};

  data = !isEmpty(data) ? data : "";

  if (Validator.isEmpty(data)) {
    errors.touser = "Atleast one user must be selected to create chat with";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
