const router = require("express").Router();
const validation = require("../../validation/auth");
const validate = require("../../middlewares/validate");

const authController = require("../auth/controllers");

router.post(
  "/auth/register",
  validation.register(),
  validate,
  authController.register
);
router.post("/auth/login", validation.login(), validate, authController.login);

module.exports = router;
