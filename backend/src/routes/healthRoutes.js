const express = require("express");
const { getHealth } = require("../controllers/healthController");
const { asyncHandler } = require("../errors/errorHandler");

const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     description: Returns the health status of the API
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *             example:
 *               success: true
 *               data:
 *                 status: "healthy"
 *                 timestamp: "2024-01-01T00:00:00.000Z"
 *               error: null
 */
router.get("/", asyncHandler(getHealth));

module.exports = router;

