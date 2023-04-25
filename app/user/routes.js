const router = require("express").Router();

const { verifyToken } = require("../../middlewares/auth");

const userController = require("./controllers");

router.get("/private/user/me", verifyToken, userController.me);

module.exports = router;
