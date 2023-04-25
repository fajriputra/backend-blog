const cloudinary = require("cloudinary").v2;

const { response } = require("../helpers/wrapper");
const { cloudName, cloudApiKey, cloudApiSecret } = require("../app/config");

// Configuration
cloudinary.config({
  cloud_name: cloudName,
  api_key: cloudApiKey,
  api_secret: cloudApiSecret,
});

module.exports = {
  uploadImage: (key) => {
    return (req, res, next) => {
      const image = req.body[key];
      if (!image) {
        return response(res, 400, `${key} is required`);
      }

      cloudinary.uploader.upload(
        image,
        {
          overwrite: true,
          invalidate: true,
          resource_type: "image",
          allowed_formats: ["jpg", "jpeg", "png", "webp"],
          chunk_size: 1000000, // 1MB
        },
        (error, result) => {
          if (result && result.secure_url) {
            req.file = result.secure_url;
            return next();
          }
          return response(
            res,
            400,
            `${error.message}. Only jpg, jpeg, png, webp formats allowed`,
            null
          );
        }
      );
    };
  },
};
