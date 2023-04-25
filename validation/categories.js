const { body, param } = require("express-validator");

const create = () => [
  body("name")
    .isLength({ min: 3 })
    .withMessage("Category must be at least 3 character"),
];

const update = () => [
  param("id").isMongoId(),
  body("name")
    .isLength({ min: 3 })
    .withMessage("Category must be at least 3 character"),
];

const destroy = () => [param("id").isMongoId()];

module.exports = {
  create,
  update,
  destroy,
};
