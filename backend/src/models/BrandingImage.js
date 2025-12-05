const mongoose = require("mongoose");

const brandingImageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Image name is required"],
      trim: true,
      maxlength: [200, "Name cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    imagePath: {
      type: String,
      required: [true, "Image path is required"],
      trim: true,
    },
    fileName: {
      type: String,
      required: [true, "File name is required"],
      trim: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
      trim: true,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    category: {
      type: String,
      trim: true,
      enum: ["logo", "background", "overlay", "watermark", "icon", "banner", "other"],
      default: "other",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    lastUsedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

brandingImageSchema.index({ name: 1 });
brandingImageSchema.index({ category: 1 });
brandingImageSchema.index({ isActive: 1 });
brandingImageSchema.index({ tags: 1 });
brandingImageSchema.index({ createdAt: -1 });

module.exports = mongoose.model("BrandingImage", brandingImageSchema);

