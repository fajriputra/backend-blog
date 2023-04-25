const router = require("express").Router();

const { verifyToken } = require("../../middlewares/auth");

const upload = require("../../middlewares/upload");

const uploadController = require("../upload/controllers");

router.post(
  "/private/upload-image",
  verifyToken,
  upload.uploadImage("image"),
  uploadController.uploader
);

module.exports = router;
