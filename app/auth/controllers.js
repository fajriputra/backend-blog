const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../user/model");

const { response } = require("../../helpers/wrapper");

module.exports = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const user = await User.findOne({ $or: [{ username }, { email }] });

      if (user?.username === username) {
        return response(res, 400, `Username : ${username} already exists`);
      }

      if (user?.email === email) {
        return response(res, 400, `Email : ${email} already exists`);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });

      await newUser.save();

      return response(res, 201, "Successfully registered");
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  login: async (req, res) => {
    try {
      const payload = req.body;

      const user = await User.findOne({ email: payload.email });

      if (!user) {
        return response(res, 400, `${payload.email} doesn't exists`, null);
      }

      const comparePass = await bcrypt.compare(payload.password, user.password);
      if (!comparePass) {
        return response(res, 400, `Wrong email or password`, null);
      }

      const { _id, username, email } = user._doc;
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "5h",
      });

      return response(res, 200, "Successfully log in", {
        user: {
          _id,
          username,
          email,
        },
        token,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
