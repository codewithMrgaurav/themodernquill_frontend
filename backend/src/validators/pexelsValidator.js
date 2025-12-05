const Joi = require("joi");

const searchPexelsImagesSchema = Joi.object({
  query: Joi.object({
    query: Joi.string().required().trim().min(1),
    perPage: Joi.number().integer().min(1).max(80).optional(),
    page: Joi.number().integer().min(1).optional(),
    orientation: Joi.string().valid("all", "landscape", "portrait", "square").optional(),
    size: Joi.string().valid("all", "large", "medium", "small").optional(),
    color: Joi.string()
      .valid("all", "red", "orange", "yellow", "green", "turquoise", "blue", "violet", "pink", "brown", "black", "gray", "white")
      .optional(),
  }).required(),
});

const getPexelsImageSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().required(),
  }).required(),
});

const savePexelsImageToBrandingSchema = Joi.object({
  body: Joi.object({
    pexelsId: Joi.string().required(),
    name: Joi.string().required().max(200).trim(),
    description: Joi.string().max(500).trim().optional(),
    category: Joi.string()
      .valid("logo", "background", "overlay", "watermark", "icon", "banner", "other")
      .optional(),
    tags: Joi.alternatives().try(Joi.array().items(Joi.string().trim()), Joi.string()).optional(),
    imageSize: Joi.string().valid("original", "large", "large2x", "medium", "small", "portrait", "landscape", "tiny").optional(),
  }).required(),
});

module.exports = {
  searchPexelsImagesSchema,
  getPexelsImageSchema,
  savePexelsImageToBrandingSchema,
};

