const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category_path: {
      type: String,
      slug: "name",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
