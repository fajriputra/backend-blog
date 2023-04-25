const { body, param } = require("express-validator");

const create = () => [
  body("title")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 character"),
  body("description")
    .isLength({ min: 16 })
    .withMessage("Description must be at least 16 character"),
  body("image_url").isURL().withMessage("Image URL not valid"),
  body("category").isMongoId(),
];

const readById = () => [param("id").isMongoId()];

const update = () => [
  body("title")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 character"),
  body("description")
    .isLength({ min: 16 })
    .withMessage("Description must be at least 16 character"),
  body("image_url").isURL().withMessage("Image URL not valid"),
  body("category").isMongoId(),
];

const readBySlug = () => [param("slug").isSlug()];

module.exports = {
  create,
  readById,
  update,
  readBySlug,
};
