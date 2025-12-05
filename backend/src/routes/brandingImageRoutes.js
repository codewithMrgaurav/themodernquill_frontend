const express = require("express");
const {
  getBrandingImages,
  getBrandingImage,
  createBrandingImage,
  updateBrandingImage,
  deleteBrandingImage,
  incrementUsage,
} = require("../controllers/brandingImageController");
const { uploadBrandingImage } = require("../controllers/brandingImageUploadController");
const { uploadBrandingImage: uploadMiddleware } = require("../middleware/upload");
const { asyncHandler } = require("../errors/errorHandler");
const validate = require("../middleware/validator");
const {
  createBrandingImageSchema,
  updateBrandingImageSchema,
  getBrandingImagesQuerySchema,
} = require("../validators/brandingImageValidator");

const router = express.Router();

/**
 * @swagger
 * /branding-images:
 *   get:
 *     summary: Get all branding images
 *     tags: [Branding Images]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of branding images
 */
router.get("/", validate(getBrandingImagesQuerySchema), asyncHandler(getBrandingImages));

/**
 * @swagger
 * /branding-images/{id}:
 *   get:
 *     summary: Get a branding image by ID
 *     tags: [Branding Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Branding image details
 */
router.get("/:id", asyncHandler(getBrandingImage));

/**
 * @swagger
 * /branding-images/upload:
 *   post:
 *     summary: Upload a branding image
 *     tags: [Branding Images]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *               - name
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               tags:
 *                 type: string
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 */
router.post("/upload", uploadMiddleware, asyncHandler(uploadBrandingImage));

/**
 * @swagger
 * /branding-images:
 *   post:
 *     summary: Create a branding image from metadata
 *     tags: [Branding Images]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Branding image created
 */
router.post("/", validate(createBrandingImageSchema), asyncHandler(createBrandingImage));

/**
 * @swagger
 * /branding-images/{id}:
 *   patch:
 *     summary: Update a branding image
 *     tags: [Branding Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Branding image updated
 */
router.patch("/:id", validate(updateBrandingImageSchema), asyncHandler(updateBrandingImage));

/**
 * @swagger
 * /branding-images/{id}:
 *   delete:
 *     summary: Delete a branding image
 *     tags: [Branding Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Branding image deleted
 */
router.delete("/:id", asyncHandler(deleteBrandingImage));

/**
 * @swagger
 * /branding-images/{id}/increment-usage:
 *   post:
 *     summary: Increment usage count for a branding image
 *     tags: [Branding Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usage count incremented
 */
router.post("/:id/increment-usage", asyncHandler(incrementUsage));

module.exports = router;

