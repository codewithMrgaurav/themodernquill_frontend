const express = require("express");
const { trackEngagement, getEngagementStats } = require("../controllers/engagementController");
const { asyncHandler } = require("../errors/errorHandler");

const router = express.Router();

/**
 * @swagger
 * /engagement/track:
 *   post:
 *     summary: Track user engagement
 *     tags: [Engagement]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [post_view, url_click, page_scroll, batch]
 *               postId:
 *                 type: string
 *               postSlug:
 *                 type: string
 *               url:
 *                 type: string
 *               referrer:
 *                 type: string
 *               page:
 *                 type: string
 *               scrollDepth:
 *                 type: number
 *               data:
 *                 type: object
 *               sessionId:
 *                 type: string
 *               timestamp:
 *                 type: number
 *     responses:
 *       201:
 *         description: Engagement tracked successfully
 */
router.post("/track", asyncHandler(trackEngagement));

/**
 * @swagger
 * /engagement/stats:
 *   get:
 *     summary: Get engagement statistics
 *     tags: [Engagement]
 *     parameters:
 *       - in: query
 *         name: postId
 *         schema:
 *           type: string
 *       - in: query
 *         name: sessionId
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
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
 *     responses:
 *       200:
 *         description: Engagement statistics
 */
router.get("/stats", asyncHandler(getEngagementStats));

module.exports = router;

