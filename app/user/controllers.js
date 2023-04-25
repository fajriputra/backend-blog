const jwt = require("jsonwebtoken");
const { response } = require("../../helpers/wrapper");
const UserModel = require("./model");

module.exports = {
  me: async (req, res) => {
    try {
      const { id } = req.user;

      const findUser = await UserModel.findOne({
        _id: id,
      });

      if (!findUser) {
        return response(res, 404, "User not found", null);
      }

      const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "5h",
      });

      return response(res, 200, "Successfully getting data", {
        user: {
          _id: findUser._id,
          username: findUser.username,
          email: findUser.email,
        },
        token,
      });
    } catch (error) {
      return response(res, 500, error.message);
    }
  },
};
