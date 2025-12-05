const express = require("express");
const {
  getSubscribers,
  getSubscriber,
  subscribe,
  unsubscribe,
  updateSubscriber,
  deleteSubscriber,
} = require("../controllers/newsletterController");
const { asyncHandler } = require("../errors/errorHandler");
const validate = require("../middleware/validator");
const { newsletterRateLimiter } = require("../middleware/rateLimiter");
const {
  subscribeSchema,
  updateNewsletterSchema,
  getNewsletterQuerySchema,
} = require("../validators/newsletterValidator");

const router = express.Router();

/**
 * @swagger
 * /newsletter:
 *   get:
 *     summary: Get all newsletter subscribers
 *     tags: [Newsletter]
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
 *         name: isActive
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of subscribers
 */
router.get("/", validate(getNewsletterQuerySchema), asyncHandler(getSubscribers));

/**
 * @swagger
 * /newsletter/{id}:
 *   get:
 *     summary: Get a subscriber by ID
 *     tags: [Newsletter]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subscriber details
 */
router.get("/:id", asyncHandler(getSubscriber));

/**
 * @swagger
 * /newsletter/subscribe:
 *   post:
 *     summary: Subscribe to newsletter
 *     description: Maximum 3 subscriptions per IP address per 24 hours
 *     tags: [Newsletter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "subscriber@example.com"
 *               source:
 *                 type: string
 *                 example: "website"
 *           example:
 *             email: "subscriber@example.com"
 *             source: "website"
 *     responses:
 *       201:
 *         description: Successfully subscribed
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 _id: "507f1f77bcf86cd799439016"
 *                 email: "subscriber@example.com"
 *                 isActive: true
 *                 subscribedAt: "2024-01-01T00:00:00.000Z"
 *                 source: "website"
 *               error: null
 *       409:
 *         description: Email already subscribed
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               data: null
 *               error:
 *                 message: "Email is already subscribed"
 *                 code: "CONFLICT"
 *       429:
 *         description: Rate limit exceeded - Maximum 3 subscriptions per IP per 24 hours
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               data: null
 *               error:
 *                 message: "Maximum subscription limit reached (3 per 24 hours). You can subscribe again after 20 hour(s)."
 *                 code: "RATE_LIMIT_EXCEEDED"
 */
router.post("/subscribe", newsletterRateLimiter, validate(subscribeSchema), asyncHandler(subscribe));

/**
 * @swagger
 * /newsletter/unsubscribe:
 *   post:
 *     summary: Unsubscribe from newsletter
 *     tags: [Newsletter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Successfully unsubscribed
 */
router.post("/unsubscribe", asyncHandler(unsubscribe));

/**
 * @swagger
 * /newsletter/{id}:
 *   patch:
 *     summary: Update a subscriber
 *     tags: [Newsletter]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subscriber updated successfully
 */
router.patch("/:id", validate(updateNewsletterSchema), asyncHandler(updateSubscriber));

/**
 * @swagger
 * /newsletter/{id}:
 *   delete:
 *     summary: Delete a subscriber
 *     tags: [Newsletter]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subscriber deleted successfully
 */
router.delete("/:id", asyncHandler(deleteSubscriber));

module.exports = router;

