const express = require("express");
const { searchPexelsImages, getPexelsImage, savePexelsImageToBranding } = require("../controllers/pexelsController");
const { asyncHandler } = require("../errors/errorHandler");
const validate = require("../middleware/validator");
const {
  searchPexelsImagesSchema,
  getPexelsImageSchema,
  savePexelsImageToBrandingSchema,
} = require("../validators/pexelsValidator");

const router = express.Router();

/**
 * @swagger
 * /pexels/search:
 *   get:
 *     summary: Search images from Pexels
 *     tags: [Pexels]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 80
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: orientation
 *         schema:
 *           type: string
 *           enum: [all, landscape, portrait, square]
 *       - in: query
 *         name: size
 *         schema:
 *           type: string
 *           enum: [all, large, medium, small]
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *           enum: [all, red, orange, yellow, green, turquoise, blue, violet, pink, brown, black, gray, white]
 *     responses:
 *       200:
 *         description: Search results
 */
router.get("/search", validate(searchPexelsImagesSchema), asyncHandler(searchPexelsImages));

/**
 * @swagger
 * /pexels/{id}:
 *   get:
 *     summary: Get a Pexels image by ID
 *     tags: [Pexels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Image details
 */
router.get("/:id", validate(getPexelsImageSchema), asyncHandler(getPexelsImage));

/**
 * @swagger
 * /pexels/save-to-branding:
 *   post:
 *     summary: Save a Pexels image to branding images
 *     tags: [Pexels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pexelsId
 *               - name
 *             properties:
 *               pexelsId:
 *                 type: string
 *               name:
 *                 type: string
 *                 maxLength: 200
 *               description:
 *                 type: string
 *                 maxLength: 500
 *               category:
 *                 type: string
 *                 enum: [logo, background, overlay, watermark, icon, banner, other]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               imageSize:
 *                 type: string
 *                 enum: [original, large, large2x, medium, small, portrait, landscape, tiny]
 *     responses:
 *       201:
 *         description: Image saved successfully
 */
router.post("/save-to-branding", validate(savePexelsImageToBrandingSchema), asyncHandler(savePexelsImageToBranding));

module.exports = router;

