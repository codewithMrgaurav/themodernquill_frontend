const Joi = require("joi");

const createBrandingImageSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().required().max(200).trim(),
    description: Joi.string().max(500).trim().optional(),
    imageUrl: Joi.string().required().trim(),
    imagePath: Joi.string().required().trim(),
    fileName: Joi.string().required().trim(),
    fileSize: Joi.number().required().min(0),
    mimeType: Joi.string().required().trim(),
    width: Joi.number().optional().min(0),
    height: Joi.number().optional().min(0),
    category: Joi.string()
      .valid("logo", "background", "overlay", "watermark", "icon", "banner", "other")
      .optional(),
    tags: Joi.array().items(Joi.string().trim()).optional(),
    isActive: Joi.boolean().optional(),
  }).required(),
});

const updateBrandingImageSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().max(200).trim().optional(),
    description: Joi.string().max(500).trim().optional(),
    imageUrl: Joi.string().trim().optional(),
    imagePath: Joi.string().trim().optional(),
    fileName: Joi.string().trim().optional(),
    fileSize: Joi.number().min(0).optional(),
    mimeType: Joi.string().trim().optional(),
    width: Joi.number().min(0).optional(),
    height: Joi.number().min(0).optional(),
    category: Joi.string()
      .valid("logo", "background", "overlay", "watermark", "icon", "banner", "other")
      .optional(),
    tags: Joi.array().items(Joi.string().trim()).optional(),
    isActive: Joi.boolean().optional(),
  }).min(1),
  params: Joi.object({
    id: Joi.string().required(),
  }).required(),
});

const getBrandingImagesQuerySchema = Joi.object({
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    category: Joi.string()
      .valid("logo", "background", "overlay", "watermark", "icon", "banner", "other")
      .optional(),
    isActive: Joi.boolean().optional(),
    search: Joi.string().trim().optional(),
    tag: Joi.string().trim().optional(),
  }).optional(),
});

module.exports = {
  createBrandingImageSchema,
  updateBrandingImageSchema,
  getBrandingImagesQuerySchema,
};

