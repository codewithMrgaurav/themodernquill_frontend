const Joi = require("joi");

const createUserSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().required().max(100).trim(),
    email: Joi.string().required().email().lowercase().trim(),
    password: Joi.string().required().min(6).max(100),
    role: Joi.string().valid("user", "author", "admin").optional(),
    avatar: Joi.string().uri().optional(),
    bio: Joi.string().max(500).trim().optional(),
    isActive: Joi.boolean().optional(),
  }).required(),
});

const updateUserSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().max(100).trim().optional(),
    email: Joi.string().email().lowercase().trim().optional(),
    password: Joi.string().min(6).max(100).optional(),
    role: Joi.string().valid("user", "author", "admin").optional(),
    avatar: Joi.string().uri().optional(),
    bio: Joi.string().max(500).trim().optional(),
    isActive: Joi.boolean().optional(),
    isEmailVerified: Joi.boolean().optional(),
  }).min(1),
  params: Joi.object({
    id: Joi.string().required(),
  }).required(),
});

const getUserQuerySchema = Joi.object({
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    role: Joi.string().valid("user", "author", "admin").optional(),
    isActive: Joi.boolean().optional(),
    search: Joi.string().trim().optional(),
  }).optional(),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  getUserQuerySchema,
};

