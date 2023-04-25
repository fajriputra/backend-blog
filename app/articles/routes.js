const router = require("express").Router();

const { verifyToken } = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");

const validation = require("../../validation/articles");

const articleController = require("../articles/controllers");

router.post(
  "/private/articles",
  verifyToken,
  validation.create(),
  validate,
  articleController.create
);
router.get(
  "/private/articles",
  verifyToken,
  articleController.privateListArticles
);
router.get(
  "/private/articles/:id",
  verifyToken,
  validation.readById(),
  validate,
  articleController.readById
);
router.put(
  "/private/articles/:id",
  verifyToken,
  validation.update(),
  validate,
  articleController.update
);
router.delete(
  "/private/articles/:id",
  verifyToken,
  validation.readById(),
  validate,
  articleController.delete
);

router.get("/public/articles", articleController.publicListArticles);
router.get(
  "/public/articles/:category_path/:slug",
  validation.readBySlug(),
  validate,
  articleController.readBySlug
);

module.exports = router;
