const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
    },
    slug: {
      type: String,
      slug: "title",
    },
    description: {
      type: String,
    },
    image_url: {
      type: String,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    category_path: {
      type: String,
      ref: "Category",
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", ArticleSchema);
