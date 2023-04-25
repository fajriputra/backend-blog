const CategoryModel = require("./model");

const { response } = require("../../helpers/wrapper");
const { convertToSlug } = require("../../helpers/slug");
const { removeSpace } = require("../../helpers/trim");

module.exports = {
  create: async (req, res) => {
    try {
      let { name } = req.body;
      name = removeSpace(name);
      const findCategory = await CategoryModel.findOne({
        name: {
          $regex: name,
          $options: "i",
        },
      });
      if (findCategory) {
        return response(res, 400, `Category ${name} already exists`);
      }

      const category = new CategoryModel({
        name,
        category_path: convertToSlug(name),
      });

      await category.save();

      return response(res, 201, "Successfully created category");
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  publicListCategory: async (_, res) => {
    try {
      const categories = await CategoryModel.find();

      if (!categories)
        return response(res, 200, "Categories was not found", []);

      return response(res, 200, "Successfully getting data", categories);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  privateListCategory: async (req, res) => {
    try {
      let { size, page, q } = req.query;

      size = Number(size) || 10;
      page = Number(page) || 1;
      q = q || "";

      let criteria = {};

      if (q) criteria = { ...criteria, name: { $regex: q, $options: "i" } };

      let offset = page * size - size;
      const totalData = await CategoryModel.find(criteria).countDocuments();
      const totalPage = Math.ceil(totalData / size);

      if (totalPage < page) {
        offset = 0;
        page = 1;
      }

      const categories = await CategoryModel.find(criteria)
        .skip(offset)
        .limit(size);

      if (!categories.length)
        return response(res, 200, "Categories was not found", []);

      return response(res, 200, "Successfully getting data", categories, {
        size,
        total_data: totalData,
        total_page: totalPage,
        current_page: page,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  read: async (req, res) => {
    try {
      const { id } = req.params;

      const category = await CategoryModel.findById(id);

      if (!category) return response(res, 404, "Category was not found", null);

      return response(res, 200, "Successfully getting data", category);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  update: async (req, res) => {
    try {
      const { id: _id } = req.params;
      let { name } = req.body;
      name = removeSpace(name);

      const findCategory = await CategoryModel.find({
        $or: [
          { _id },
          {
            name: {
              $regex: removeSpace(name),
              $options: "i",
            },
          },
        ],
      }).limit(2);

      if (findCategory.length == 2) {
        return response(res, 400, `Category ${name} already exists`);
      }

      if (findCategory[0]?._id != _id) {
        return response(res, 404, "Category was not found", null);
      }

      await CategoryModel.findByIdAndUpdate(
        _id,
        { $set: { name, category_path: convertToSlug(name) } },
        { new: true }
      );

      return response(res, 200, "Successfully updated category");
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const category = await CategoryModel.findById(id);

      if (!category) return response(res, 404, "Category was not found", null);

      await CategoryModel.findByIdAndDelete(id);

      return response(res, 200, "Successfully deleted category");
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
