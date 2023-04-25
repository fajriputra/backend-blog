const { body } = require("express-validator");

const register = () => [
  body("username").isLength({ min: 3, max: 16 }),
  body("email").isEmail(),
  body("password").isStrongPassword({
    minLength: 6,
    minSymbols: 0,
    minUppercase: 0,
    minLowercase: 0,
    minNumbers: 0,
  }),
];

const login = () => [
  body("email").isEmail(),
  body("password").isStrongPassword({
    minLength: 6,
    minSymbols: 0,
    minUppercase: 0,
  }),
];

module.exports = {
  register,
  login,
};
