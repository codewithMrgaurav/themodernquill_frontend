const BrandingImage = require("../models/BrandingImage");
const { sendSuccess, sendError } = require("../utils/response");
const { HTTP_STATUS, ERROR_CODES } = require("../config/constants");
const path = require("path");
const sizeOf = require("image-size");

async function uploadBrandingImage(req, res) {
  try {
    if (!req.file) {
      return sendError(res, "No image file provided", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const { name, description, category, tags } = req.body;

    if (!name || !name.trim()) {
      return sendError(res, "Image name is required", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const file = req.file;
    const imagePath = path.relative(process.cwd(), file.path);
    const imageUrl = `/uploads/branding-images/${path.basename(file.path)}`;

    let width, height;
    try {
      const dimensions = sizeOf(file.path);
      width = dimensions.width;
      height = dimensions.height;
    } catch (error) {
      console.warn("Could not determine image dimensions:", error.message);
    }

    const imageData = {
      name: name.trim(),
      description: description?.trim() || "",
      imageUrl,
      imagePath,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      width,
      height,
      category: category || "other",
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim())) : [],
      isActive: true,
    };

    const image = await BrandingImage.create(imageData);

    return sendSuccess(res, image.toObject(), "Branding image uploaded successfully", HTTP_STATUS.CREATED);
  } catch (error) {
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map((e) => e.message).join(", ");
      return sendError(res, message, HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_CODES.VALIDATION_ERROR);
    }
    console.error("Error uploading branding image:", error);
    return sendError(res, "Failed to upload branding image", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

module.exports = {
  uploadBrandingImage,
};

