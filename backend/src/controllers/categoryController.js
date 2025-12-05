const Category = require("../models/Category");
const { sendSuccess, sendError } = require("../utils/response");
const { HTTP_STATUS, ERROR_CODES } = require("../config/constants");

async function getCategories(_req, res) {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ name: 1 })
      .lean();

    return sendSuccess(res, categories, "Categories fetched successfully");
  } catch (error) {
    console.error("Error fetching categories:", error);
    return sendError(res, "Failed to fetch categories", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

async function getCategory(req, res) {
  try {
    const { slug } = req.params;

    if (!slug || !slug.trim()) {
      return sendError(res, "Slug is required", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const category = await Category.findOne({ slug: slug.trim(), isActive: true }).lean();

    if (!category) {
      return sendError(res, "Category not found", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }

    const Post = require("../models/Post");
    const postCount = await Post.countDocuments({ category: category._id, status: "published" });
    category.postCount = postCount;

    return sendSuccess(res, category, "Category fetched successfully");
  } catch (error) {
    console.error("Error fetching category:", error);
    return sendError(res, "Failed to fetch category", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

async function createCategory(req, res) {
  try {
    const categoryData = req.body;

    const existing = await Category.findOne({
      $or: [{ name: categoryData.name }, { slug: categoryData.slug }],
    });

    if (existing) {
      return sendError(res, "Category with this name or slug already exists", HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT);
    }

    const category = await Category.create(categoryData);
    return sendSuccess(res, category.toObject(), "Category created successfully", HTTP_STATUS.CREATED);
  } catch (error) {
    if (error.code === 11000) {
      return sendError(res, "Category with this name or slug already exists", HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT);
    }
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map((e) => e.message).join(", ");
      return sendError(res, message, HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_CODES.VALIDATION_ERROR);
    }
    console.error("Error creating category:", error);
    return sendError(res, "Failed to create category", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

async function updateCategory(req, res) {
  try {
    const { id } = req.params;

    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return sendError(res, "Invalid category ID format", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const updateData = req.body;

    if (updateData.name || updateData.slug) {
      const existing = await Category.findOne({
        $or: [
          ...(updateData.name ? [{ name: updateData.name }] : []),
          ...(updateData.slug ? [{ slug: updateData.slug }] : []),
        ],
        _id: { $ne: id },
      });

      if (existing) {
        return sendError(res, "Category with this name or slug already exists", HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT);
      }
    }

    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return sendError(res, "Category not found", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }

    return sendSuccess(res, category.toObject(), "Category updated successfully");
  } catch (error) {
    if (error.code === 11000) {
      return sendError(res, "Category with this name or slug already exists", HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT);
    }
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map((e) => e.message).join(", ");
      return sendError(res, message, HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_CODES.VALIDATION_ERROR);
    }
    console.error("Error updating category:", error);
    return sendError(res, "Failed to update category", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
};
