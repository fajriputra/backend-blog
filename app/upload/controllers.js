const { response } = require("../../helpers/wrapper");

module.exports = {
  uploader: (req, res) => {
    req.file;

    return response(res, 200, "Successfully uploaded", { image_url: req.file });
  },
};
