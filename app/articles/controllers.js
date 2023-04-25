const ArticleModel = require("./model");
const CategoryModel = require("../categories/model");
const { Types } = require("mongoose");
const { response } = require("../../helpers/wrapper");
const { convertToSlug } = require("../../helpers/slug");
const { removeSpace } = require("../../helpers/trim");

module.exports = {
  create: async (req, res) => {
    try {
      let { title, description, image_url, category } = req.body;
      title = removeSpace(title);

      const [findArticle, findCategory] = await Promise.all([
        ArticleModel.findOne({
          title: {
            $regex: title,
            $options: "i",
          },
        }),
        CategoryModel.findOne({
          _id: category,
        }),
      ]);

      if (!findCategory) {
        return response(res, 400, `Category doesn't exists`);
      }

      if (findArticle) {
        return response(res, 400, `Article ${title} already exists`);
      }

      const articles = new ArticleModel({
        title,
        description,
        image_url,
        category: new Types.ObjectId(category),
        slug: convertToSlug(req.body.title),
        author: req.user.id,
      });

      await articles.save();

      return response(res, 201, "Successfully created article");
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  publicListArticles: async (req, res) => {
    try {
      let { size, page, q, category } = req.query;

      size = Number(size) || 10;
      page = Number(page) || 1;
      q = q || "";
      category = category || "";

      let criteria = {};

      if (q) criteria = { ...criteria, title: { $regex: q, $options: "i" } };

      if (category) {
        const categories = await CategoryModel.findOne({
          name: { $regex: category, $options: "i" },
        });

        if (categories) {
          criteria = { ...criteria, category: categories._id };
        }
      }

      let offset = page * size - size;
      const totalData = await ArticleModel.find(criteria).countDocuments();
      const totalPage = Math.ceil(totalData / size);

      if (totalPage < page) {
        offset = 0;
        page = 1;
      }

      const articles = await ArticleModel.find(criteria)
        .skip(offset)
        .limit(size)
        .populate("author", "username")
        .populate("category", ["name", "category_path"]);

      if (!articles.length)
        return response(res, 200, "Articles was not found", []);

      return response(res, 200, "Successfully getting data", articles, {
        size,
        total_data: totalData,
        total_page: totalPage,
        current_page: page,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  privateListArticles: async (req, res) => {
    try {
      let { size, page, q, category } = req.query;

      size = Number(size) || 10;
      page = Number(page) || 1;
      q = q || "";
      category = category || "";

      let criteria = {};

      if (q) criteria = { ...criteria, title: { $regex: q, $options: "i" } };

      if (category) {
        const categories = await CategoryModel.findOne({
          name: { $regex: category, $options: "i" },
        });

        if (categories) {
          criteria = { ...criteria, category: categories._id };
        }
      }

      let offset = page * size - size;
      const totalData = await ArticleModel.find(criteria).countDocuments();
      const totalPage = Math.ceil(totalData / size);

      if (totalPage < page) {
        offset = 0;
        page = 1;
      }

      const articles = await ArticleModel.find(criteria)
        .skip(offset)
        .limit(size)
        .populate("author", "username")
        .populate("category", ["name", "category_path"]);

      if (!articles.length)
        return response(res, 200, "Articles was not found", []);

      return response(res, 200, "Successfully getting data", articles, {
        size,
        total_data: totalData,
        total_page: totalPage,
        current_page: page,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  readById: async (req, res) => {
    try {
      const { id } = req.params;

      const articles = await ArticleModel.findById(id)
        .populate("author", "username")
        .populate("category", ["name", "category_path"]);

      if (!articles) return response(res, 404, "Article was not found", null);

      articles.views += 1;

      await articles.save();

      return response(res, 200, "Successfully getting data", articles);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  readBySlug: async (req, res) => {
    try {
      const { category_path, slug } = req.params;

      const articles = await ArticleModel.findOne({
        slug,
      })
        .populate("author", "username")
        .populate("category", ["name", "category_path"]);

      if (!articles || articles.category.category_path !== category_path)
        return response(res, 404, "Article was not found", null);
      articles.views += 1;

      await articles.save();

      return response(res, 200, "Successfully getting data", articles);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  update: async (req, res) => {
    try {
      const { id: _id } = req.params;
      let { title, description, image_url, category } = req.body;
      title = removeSpace(title);

      const [findCategory, findArticle] = await Promise.all([
        CategoryModel.findOne({
          _id: category,
        }),
        ArticleModel.find({
          $or: [
            { _id },
            {
              title: {
                $regex: title,
                $options: "i",
              },
            },
          ],
        }).limit(2),
      ]);

      if (findArticle.length == 2) {
        return response(res, 400, `Article ${title} already exists`);
      }

      if (findArticle[0]?._id != _id) {
        return response(res, 404, "Article was not found", null);
      }

      if (!findCategory) {
        return response(res, 400, `Category doesn't exists`);
      }

      if (findArticle[0].author.toString() !== req.user.id.toString()) {
        return response(res, 403, "You only can delete your own posts");
      }

      await ArticleModel.findByIdAndUpdate(
        _id,
        {
          $set: {
            title,
            description,
            image_url,
            category: new Types.ObjectId(category),
            slug: convertToSlug(title),
          },
        },
        { new: true }
      )
        .populate("author", "username")
        .populate("category", ["name", "category_path"]);

      return response(res, 200, "Successfully updated article");
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const articles = await ArticleModel.findById(id);

      if (!articles) return response(res, 404, "Article was not found", null);

      if (articles.author.toString() !== req.user.id.toString()) {
        return response(res, 403, "You only can delete your own posts");
      }

      await ArticleModel.findByIdAndDelete(id);

      return response(res, 200, "Successfully deleted article");
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
