const express = require("express");
const {
  getUsers,
  getUser,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { asyncHandler } = require("../errors/errorHandler");
const validate = require("../middleware/validator");
const {
  createUserSchema,
  updateUserSchema,
  getUserQuerySchema,
} = require("../validators/userValidator");

const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: "john"
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         example: "user"
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - _id: "507f1f77bcf86cd799439015"
 *                   name: "John Doe"
 *                   email: "john@example.com"
 *                   role: "user"
 *                   isActive: true
 *                   createdAt: "2024-01-01T00:00:00.000Z"
 *               pagination:
 *                 page: 1
 *                 limit: 10
 *                 total: 25
 *                 totalPages: 3
 *               error: null
 */
router.get("/", validate(getUserQuerySchema), asyncHandler(getUsers));

/**
 * @swagger
 * /users/email/{email}:
 *   get:
 *     summary: Get a user by email
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 */
router.get("/email/:email", asyncHandler(getUserByEmail));

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 */
router.get("/:id", asyncHandler(getUser));

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SecurePassword123!"
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: "user"
 *               avatar:
 *                 type: string
 *                 example: "https://example.com/avatar.jpg"
 *               bio:
 *                 type: string
 *                 example: "Software developer"
 *           example:
 *             name: "John Doe"
 *             email: "john@example.com"
 *             password: "SecurePassword123!"
 *             role: "user"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 _id: "507f1f77bcf86cd799439015"
 *                 name: "John Doe"
 *                 email: "john@example.com"
 *                 role: "user"
 *                 isActive: true
 *                 isEmailVerified: false
 *                 createdAt: "2024-01-01T00:00:00.000Z"
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
 */
router.post("/", validate(createUserSchema), asyncHandler(createUser));

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.patch("/:id", validate(updateUserSchema), asyncHandler(updateUser));

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete("/:id", asyncHandler(deleteUser));

module.exports = router;

