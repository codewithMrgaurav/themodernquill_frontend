const express = require("express");
const { trackNavigation, getUserNavigation, getNavigationStats } = require("../controllers/navigationController");
const { asyncHandler } = require("../errors/errorHandler");
const { optionalAuth } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * /navigation/track:
 *   post:
 *     summary: Track user navigation
 *     tags: [Navigation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - page
 *             properties:
 *               page:
 *                 type: string
 *                 example: "/blog/my-post"
 *               pageTitle:
 *                 type: string
 *                 example: "My Blog Post"
 *               referrer:
 *                 type: string
 *                 example: "/"
 *               timeSpent:
 *                 type: number
 *                 example: 120000
 *               metadata:
 *                 type: object
 *     responses:
 *       201:
 *         description: Navigation tracked successfully
 */
router.post("/track", optionalAuth, asyncHandler(trackNavigation));

/**
 * @swagger
 * /navigation/history:
 *   get:
 *     summary: Get user navigation history
 *     tags: [Navigation]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Navigation history
 */
router.get("/history", optionalAuth, asyncHandler(getUserNavigation));

/**
 * @swagger
 * /navigation/stats:
 *   get:
 *     summary: Get navigation statistics
 *     tags: [Navigation]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Navigation statistics
 */
router.get("/stats", optionalAuth, asyncHandler(getNavigationStats));

module.exports = router;

