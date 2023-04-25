const { validationResult } = require("express-validator");
const { responseErr } = require("../helpers/wrapper");

const validate = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }
  return responseErr(res, "Validation Error Occured", result.array());
};

module.exports = validate;
