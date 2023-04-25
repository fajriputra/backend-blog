const jwt = require("jsonwebtoken");

const { response } = require("../helpers/wrapper");

module.exports = {
  verifyToken: async (req, res, next) => {
    if (!req.headers.authorization)
      return response(res, 403, "Not Authorized. Please login first");

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err)
          return response(res, 403, "Token has expired. Please log back in");

        req.user = data;
        next();
      });
    }
  },
};
