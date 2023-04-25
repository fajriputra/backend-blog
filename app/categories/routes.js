const router = require("express").Router();

const { verifyToken } = require("../../middlewares/auth");
const validation = require("../../validation/categories");
const validate = require("../../middlewares/validate");

const categoriesController = require("../categories/controllers");

router.post(
  "/private/categories",
  verifyToken,
  validation.create(),
  validate,
  categoriesController.create
);
router.get(
  "/private/categories",
  verifyToken,
  categoriesController.privateListCategory
);
router.get("/private/categories/:id", verifyToken, categoriesController.read);
router.put(
  "/private/categories/:id",
  verifyToken,
  validation.update(),
  validate,
  categoriesController.update
);
router.delete(
  "/private/categories/:id",
  verifyToken,
  validation.destroy(),
  validate,
  categoriesController.delete
);

router.get("/public/categories", categoriesController.publicListCategory);

module.exports = router;
