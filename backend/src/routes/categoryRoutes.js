const express = require("express");
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
} = require("../controllers/categoryController");
const { asyncHandler } = require("../errors/errorHandler");
const validate = require("../middleware/validator");
const {
  createCategorySchema,
  updateCategorySchema,
} = require("../validators/categoryValidator");

const router = express.Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - _id: "507f1f77bcf86cd799439011"
 *                   name: "Technology"
 *                   slug: "technology"
 *                   description: "Latest tech news and tutorials"
 *                   image: "https://example.com/tech.jpg"
 *                   createdAt: "2024-01-01T00:00:00.000Z"
 *                 - _id: "507f1f77bcf86cd799439012"
 *                   name: "Lifestyle"
 *                   slug: "lifestyle"
 *                   description: "Lifestyle tips and advice"
 *                   image: "https://example.com/lifestyle.jpg"
 *                   createdAt: "2024-01-01T00:00:00.000Z"
 *               error: null
 */
router.get("/", asyncHandler(getCategories));

/**
 * @swagger
 * /categories/{slug}:
 *   get:
 *     summary: Get a category by slug
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         example: "technology"
 *     responses:
 *       200:
 *         description: Category details
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 _id: "507f1f77bcf86cd799439011"
 *                 name: "Technology"
 *                 slug: "technology"
 *                 description: "Latest tech news and tutorials"
 *                 image: "https://example.com/tech.jpg"
 *                 createdAt: "2024-01-01T00:00:00.000Z"
 *                 updatedAt: "2024-01-01T00:00:00.000Z"
 *               error: null
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               data: null
 *               error:
 *                 message: "Category not found"
 *                 code: "NOT_FOUND"
 */
router.get("/:slug", asyncHandler(getCategory));

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Technology"
 *               slug:
 *                 type: string
 *                 example: "technology"
 *               description:
 *                 type: string
 *                 example: "Latest tech news and tutorials"
 *               image:
 *                 type: string
 *                 example: "https://example.com/tech.jpg"
 *           example:
 *             name: "Technology"
 *             slug: "technology"
 *             description: "Latest tech news and tutorials"
 *             image: "https://example.com/tech.jpg"
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 _id: "507f1f77bcf86cd799439011"
 *                 name: "Technology"
 *                 slug: "technology"
 *                 description: "Latest tech news and tutorials"
 *                 image: "https://example.com/tech.jpg"
 *                 createdAt: "2024-01-01T00:00:00.000Z"
 *                 updatedAt: "2024-01-01T00:00:00.000Z"
 *               error: null
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               data: null
 *               error:
 *                 message: "Name is required"
 *                 code: "VALIDATION_ERROR"
 */
router.post("/", validate(createCategorySchema), asyncHandler(createCategory));

/**
 * @swagger
 * /categories/{id}:
 *   patch:
 *     summary: Update a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             description: "Updated description"
 *             image: "https://example.com/new-image.jpg"
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 _id: "507f1f77bcf86cd799439011"
 *                 name: "Technology"
 *                 slug: "technology"
 *                 description: "Updated description"
 *                 image: "https://example.com/new-image.jpg"
 *                 updatedAt: "2024-01-02T00:00:00.000Z"
 *               error: null
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               data: null
 *               error:
 *                 message: "Category not found"
 *                 code: "NOT_FOUND"
 */
router.patch("/:id", validate(updateCategorySchema), asyncHandler(updateCategory));

module.exports = router;
