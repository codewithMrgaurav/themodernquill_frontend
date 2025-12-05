const Joi = require("joi");

/**
 * Validation schema for creating a category
 */
const createCategorySchema = Joi.object({
  body: Joi.object({
    name: Joi.string().required().max(100).trim(),
    slug: Joi.string().required().lowercase().trim(),
    description: Joi.string().max(500).trim().optional(),
    icon: Joi.string().trim().optional(),
    isActive: Joi.boolean().optional(),
  }).required(),
});

/**
 * Validation schema for updating a category
 */
const updateCategorySchema = Joi.object({
  body: Joi.object({
    name: Joi.string().max(100).trim().optional(),
    description: Joi.string().max(500).trim().optional(),
    icon: Joi.string().trim().optional(),
    isActive: Joi.boolean().optional(),
  }).min(1),
  params: Joi.object({
    id: Joi.string().required(),
  }).required(),
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
};
