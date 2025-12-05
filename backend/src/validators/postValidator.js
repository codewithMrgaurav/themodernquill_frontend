const Joi = require("joi");

/**
 * Validation schema for creating a post
 */
const contentBlockSchema = Joi.object({
  type: Joi.string()
    .valid(
      "paragraph",
      "heading",
      "image",
      "video",
      "code",
      "quote",
      "list",
      "table",
      "divider",
      "embed",
      "gallery",
      "custom"
    )
    .required(),
  data: Joi.any().required(),
  order: Joi.number().optional(),
  id: Joi.string().optional(),
});

const createPostSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().required().max(200).trim(),
    slug: Joi.string().required().lowercase().trim(),
    excerpt: Joi.string().required().max(500).trim(),
    description: Joi.string().required().trim(),
    content: Joi.string().optional(),
    contentBlocks: Joi.array().items(contentBlockSchema).optional(),
    category: Joi.string().required(),
    image: Joi.string().required().uri(),
    hashtags: Joi.array().items(Joi.string().trim()).optional(),
    keywords: Joi.array().items(Joi.string().trim()).optional(),
    readTime: Joi.string().optional(),
    status: Joi.string().valid("draft", "published", "archived").optional(),
    isFeatured: Joi.boolean().optional(),
    parentPost: Joi.string().optional(),
    brandingImage: Joi.string().optional(),
  })
    .or("content", "contentBlocks")
    .required(),
});

/**
 * Validation schema for updating a post
 */
const updatePostSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().max(200).trim().optional(),
    excerpt: Joi.string().max(500).trim().optional(),
    description: Joi.string().trim().optional(),
    content: Joi.string().optional(),
    contentBlocks: Joi.array().items(contentBlockSchema).optional(),
    category: Joi.string().optional(),
    image: Joi.string().uri().optional(),
    hashtags: Joi.array().items(Joi.string().trim()).optional(),
    keywords: Joi.array().items(Joi.string().trim()).optional(),
    readTime: Joi.string().optional(),
    status: Joi.string().valid("draft", "published", "archived").optional(),
    isFeatured: Joi.boolean().optional(),
    parentPost: Joi.string().optional(),
    brandingImage: Joi.string().optional(),
  }).min(1),
  params: Joi.object({
    id: Joi.string().required(),
  }).required(),
});

/**
 * Validation schema for query parameters (pagination, filters)
 */
const getPostsQuerySchema = Joi.object({
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    status: Joi.string().valid("draft", "published", "archived").optional(),
    category: Joi.string().optional(),
    search: Joi.string().trim().optional(),
    parentPost: Joi.string().allow(null).optional(),
    topLevelOnly: Joi.boolean().optional(),
  }).optional(),
});

module.exports = {
  createPostSchema,
  updatePostSchema,
  getPostsQuerySchema,
};

