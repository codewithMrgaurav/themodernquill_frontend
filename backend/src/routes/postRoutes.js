const express = require("express");
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getSubposts,
} = require("../controllers/postController");
const { asyncHandler } = require("../errors/errorHandler");
const validate = require("../middleware/validator");
const {
  createPostSchema,
  updatePostSchema,
  getPostsQuerySchema,
} = require("../validators/postValidator");

const router = express.Router();

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published, archived]
 *           default: published
 *         description: Post status filter
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category ID filter
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: parentPost
 *         schema:
 *           type: string
 *         description: Filter by parent post ID
 *       - in: query
 *         name: topLevelOnly
 *         schema:
 *           type: boolean
 *         description: Get only top-level posts
 *     responses:
 *       200:
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *             example:
 *               success: true
 *               data:
 *                 - _id: "507f1f77bcf86cd799439013"
 *                   title: "Getting Started with React Hooks"
 *                   slug: "getting-started-with-react-hooks"
 *                   excerpt: "Learn how to use React Hooks..."
 *                   category:
 *                     _id: "507f1f77bcf86cd799439011"
 *                     name: "Technology"
 *                     slug: "technology"
 *                   image: "https://example.com/image.jpg"
 *                   status: "published"
 *                   views: 150
 *                   publishedAt: "2024-01-01T00:00:00.000Z"
 *               pagination:
 *                 page: 1
 *                 limit: 10
 *                 total: 50
 *                 totalPages: 5
 *                 hasNext: true
 *                 hasPrev: false
 *               error: null
 */
router.get("/", validate(getPostsQuerySchema), asyncHandler(getPosts));

/**
 * @swagger
 * /posts/{id}/subposts:
 *   get:
 *     summary: Get subposts of a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Parent post ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of subposts
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - _id: "507f1f77bcf86cd799439014"
 *                   title: "Subpost Title"
 *                   slug: "subpost-title"
 *                   category:
 *                     name: "Technology"
 *               pagination:
 *                 page: 1
 *                 limit: 10
 *                 total: 5
 *                 totalPages: 1
 *               error: null
 */
router.get("/:id/subposts", asyncHandler(getSubposts));

/**
 * @swagger
 * /posts/{slug}:
 *   get:
 *     summary: Get a post by slug
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Post slug
 *     responses:
 *       200:
 *         description: Post details
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 _id: "507f1f77bcf86cd799439013"
 *                 title: "Getting Started with React Hooks"
 *                 slug: "getting-started-with-react-hooks"
 *                 excerpt: "Learn how to use React Hooks..."
 *                 description: "A comprehensive guide..."
 *                 content: "<p>React Hooks are powerful...</p>"
 *                 category:
 *                   _id: "507f1f77bcf86cd799439011"
 *                   name: "Technology"
 *                   slug: "technology"
 *                 image: "https://example.com/image.jpg"
 *                 hashtags: ["react", "javascript"]
 *                 keywords: ["react hooks", "tutorial"]
 *                 status: "published"
 *                 views: 150
 *                 isFeatured: false
 *                 subposts: []
 *                 publishedAt: "2024-01-01T00:00:00.000Z"
 *                 createdAt: "2024-01-01T00:00:00.000Z"
 *                 updatedAt: "2024-01-01T00:00:00.000Z"
 *               error: null
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               data: null
 *               error:
 *                 message: "Post not found"
 *                 code: "NOT_FOUND"
 */
router.get("/:slug", asyncHandler(getPost));

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - slug
 *               - excerpt
 *               - description
 *               - category
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *                 example: "Getting Started with React Hooks"
 *               slug:
 *                 type: string
 *                 example: "getting-started-with-react-hooks"
 *               excerpt:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Learn how to use React Hooks to build modern React applications"
 *               description:
 *                 type: string
 *                 example: "A comprehensive guide to React Hooks for beginners"
 *               content:
 *                 type: string
 *                 example: "<p>React Hooks are a powerful feature...</p>"
 *               contentBlocks:
 *                 type: array
 *                 items:
 *                   type: object
 *                 example: []
 *               category:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *               image:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/image.jpg"
 *               hashtags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["react", "javascript", "web-development"]
 *               keywords:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["react hooks", "frontend", "tutorial"]
 *               readTime:
 *                 type: string
 *                 example: "5 min read"
 *               status:
 *                 type: string
 *                 enum: [draft, published, archived]
 *                 example: "published"
 *               isFeatured:
 *                 type: boolean
 *                 example: false
 *               parentPost:
 *                 type: string
 *                 example: null
 *               brandingImage:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439012"
 *           example:
 *             title: "Getting Started with React Hooks"
 *             slug: "getting-started-with-react-hooks"
 *             excerpt: "Learn how to use React Hooks to build modern React applications"
 *             description: "A comprehensive guide to React Hooks for beginners"
 *             content: "<p>React Hooks are a powerful feature...</p>"
 *             category: "507f1f77bcf86cd799439011"
 *             image: "https://example.com/image.jpg"
 *             hashtags: ["react", "javascript"]
 *             keywords: ["react hooks", "tutorial"]
 *             status: "published"
 *             isFeatured: false
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *             example:
 *               success: true
 *               data:
 *                 _id: "507f1f77bcf86cd799439013"
 *                 title: "Getting Started with React Hooks"
 *                 slug: "getting-started-with-react-hooks"
 *                 excerpt: "Learn how to use React Hooks..."
 *                 description: "A comprehensive guide..."
 *                 category:
 *                   _id: "507f1f77bcf86cd799439011"
 *                   name: "Technology"
 *                   slug: "technology"
 *                 image: "https://example.com/image.jpg"
 *                 status: "published"
 *                 views: 0
 *                 createdAt: "2024-01-01T00:00:00.000Z"
 *                 updatedAt: "2024-01-01T00:00:00.000Z"
 *               error: null
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               data: null
 *               error:
 *                 message: "Title is required"
 *                 code: "VALIDATION_ERROR"
 */
router.post("/", validate(createPostSchema), asyncHandler(createPost));

/**
 * @swagger
 * /posts/{id}:
 *   patch:
 *     summary: Update a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439013"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *             title: "Updated Post Title"
 *             status: "published"
 *             isFeatured: true
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 _id: "507f1f77bcf86cd799439013"
 *                 title: "Updated Post Title"
 *                 status: "published"
 *                 isFeatured: true
 *                 updatedAt: "2024-01-02T00:00:00.000Z"
 *               error: null
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               data: null
 *               error:
 *                 message: "Post not found"
 *                 code: "NOT_FOUND"
 */
router.patch("/:id", validate(updatePostSchema), asyncHandler(updatePost));

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: "507f1f77bcf86cd799439013"
 *               error: null
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               data: null
 *               error:
 *                 message: "Post not found"
 *                 code: "NOT_FOUND"
 */
router.delete("/:id", asyncHandler(deletePost));

module.exports = router;
