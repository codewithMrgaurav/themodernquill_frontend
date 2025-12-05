const BrandingImage = require("../models/BrandingImage");
const { parsePagination, createPaginationMeta } = require("../utils/pagination");
const { sendPaginated, sendSuccess, sendError } = require("../utils/response");
const { HTTP_STATUS, ERROR_CODES } = require("../config/constants");
const fs = require("fs").promises;
const path = require("path");

async function getBrandingImages(req, res) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { category, isActive, search, tag } = req.query;

    const query = {};

    if (category) {
      query.category = category;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    if (tag) {
      query.tags = { $in: [tag.trim()] };
    }

    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
        { tags: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const images = await BrandingImage.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await BrandingImage.countDocuments(query);
    const pagination = createPaginationMeta(page, limit, total);

    return sendPaginated(res, images, pagination, "Branding images fetched successfully");
  } catch (error) {
    console.error("Error fetching branding images:", error);
    return sendError(res, "Failed to fetch branding images", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

async function getBrandingImage(req, res) {
  try {
    const { id } = req.params;

    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return sendError(res, "Invalid branding image ID format", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const image = await BrandingImage.findById(id).lean();

    if (!image) {
      return sendError(res, "Branding image not found", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }

    return sendSuccess(res, image, "Branding image fetched successfully");
  } catch (error) {
    console.error("Error fetching branding image:", error);
    return sendError(res, "Failed to fetch branding image", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

async function createBrandingImage(req, res) {
  try {
    const imageData = req.body;

    if (!imageData.imageUrl || !imageData.imagePath || !imageData.fileName) {
      return sendError(res, "Image URL, path, and file name are required", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const image = await BrandingImage.create(imageData);
    const populatedImage = await BrandingImage.findById(image._id).lean();

    return sendSuccess(res, populatedImage, "Branding image created successfully", HTTP_STATUS.CREATED);
  } catch (error) {
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map((e) => e.message).join(", ");
      return sendError(res, message, HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_CODES.VALIDATION_ERROR);
    }
    console.error("Error creating branding image:", error);
    return sendError(res, "Failed to create branding image", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

async function updateBrandingImage(req, res) {
  try {
    const { id } = req.params;

    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return sendError(res, "Invalid branding image ID format", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const updateData = req.body;

    const image = await BrandingImage.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!image) {
      return sendError(res, "Branding image not found", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }

    return sendSuccess(res, image.toObject(), "Branding image updated successfully");
  } catch (error) {
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map((e) => e.message).join(", ");
      return sendError(res, message, HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_CODES.VALIDATION_ERROR);
    }
    console.error("Error updating branding image:", error);
    return sendError(res, "Failed to update branding image", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

async function deleteBrandingImage(req, res) {
  try {
    const { id } = req.params;

    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return sendError(res, "Invalid branding image ID format", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const image = await BrandingImage.findById(id);

    if (!image) {
      return sendError(res, "Branding image not found", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }

    const imagePath = image.imagePath;

    await BrandingImage.findByIdAndDelete(id);

    try {
      const fullPath = path.join(process.cwd(), imagePath);
      await fs.unlink(fullPath);
    } catch (fileError) {
      console.warn(`Failed to delete file ${imagePath}:`, fileError.message);
    }

    return sendSuccess(res, { id: image._id }, "Branding image deleted successfully");
  } catch (error) {
    console.error("Error deleting branding image:", error);
    return sendError(res, "Failed to delete branding image", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

async function incrementUsage(req, res) {
  try {
    const { id } = req.params;

    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return sendError(res, "Invalid branding image ID format", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const image = await BrandingImage.findByIdAndUpdate(
      id,
      {
        $inc: { usageCount: 1 },
        $set: { lastUsedAt: new Date() },
      },
      { new: true }
    );

    if (!image) {
      return sendError(res, "Branding image not found", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }

    return sendSuccess(res, image.toObject(), "Usage count incremented successfully");
  } catch (error) {
    console.error("Error incrementing usage:", error);
    return sendError(res, "Failed to increment usage", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

module.exports = {
  getBrandingImages,
  getBrandingImage,
  createBrandingImage,
  updateBrandingImage,
  deleteBrandingImage,
  incrementUsage,
};

