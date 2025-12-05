const Joi = require("joi");

const subscribeSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().required().email().lowercase().trim(),
    source: Joi.string().trim().optional(),
  }).required(),
});

const updateNewsletterSchema = Joi.object({
  body: Joi.object({
    isActive: Joi.boolean().optional(),
    source: Joi.string().trim().optional(),
  }).min(1),
  params: Joi.object({
    id: Joi.string().required(),
  }).required(),
});

const getNewsletterQuerySchema = Joi.object({
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    isActive: Joi.boolean().optional(),
    search: Joi.string().trim().optional(),
  }).optional(),
});

module.exports = {
  subscribeSchema,
  updateNewsletterSchema,
  getNewsletterQuerySchema,
};

