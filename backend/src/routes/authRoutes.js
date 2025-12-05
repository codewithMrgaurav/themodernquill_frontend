const express = require("express");
const { login, adminLogin, logout, getCurrentUser } = require("../controllers/authController");
const { asyncHandler } = require("../errors/errorHandler");
const { authenticate, optionalAuth } = require("../middleware/auth");
const validate = require("../middleware/validator");
const { loginSchema, adminLoginSchema } = require("../validators/authValidator");

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Authentication]
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
 *                 example: "user@example.com"
 *           example:
 *             email: "user@example.com"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 _id: "507f1f77bcf86cd799439015"
 *                 name: "John Doe"
 *                 email: "user@example.com"
 *                 role: "user"
 *                 isActive: true
 *                 lastLogin: "2024-01-01T00:00:00.000Z"
 *               error: null
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               data: null
 *               error:
 *                 message: "Email is required"
 *                 code: "VALIDATION_ERROR"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               data: null
 *               error:
 *                 message: "Invalid email or password"
 *                 code: "UNAUTHORIZED"
 */
router.post("/login", validate(loginSchema), asyncHandler(login));

/**
 * @swagger
 * /auth/admin/login:
 *   post:
 *     summary: Admin login with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "admin@themodernquill.com"
 *               password:
 *                 type: string
 *                 example: "Admin@123"
 *           example:
 *             email: "admin@themodernquill.com"
 *             password: "Admin@123"
 *     responses:
 *       200:
 *         description: Admin login successful
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Access denied - Admin privileges required
 */
router.post("/admin/login", validate(adminLoginSchema), asyncHandler(adminLogin));

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User details
 */
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post("/logout", asyncHandler(logout));

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details
 *       401:
 *         description: Unauthorized
 */
router.get("/me", authenticate, asyncHandler(getCurrentUser));

module.exports = router;

