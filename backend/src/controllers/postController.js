const Post = require("../models/Post");
const { parsePagination, createPaginationMeta } = require("../utils/pagination");
const { sendPaginated, sendSuccess, sendError } = require("../utils/response");
const { HTTP_STATUS, ERROR_CODES } = require("../config/constants");

async function getPosts(req, res) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { status = "published", category, search, parentPost, topLevelOnly } = req.query;

    const query = { status };

    if (category) {
      if (!/^[0-9a-fA-F]{24}$/.test(category)) {
        return sendError(res, "Invalid category ID format", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
      }
      query.category = category;
    }

    if (parentPost !== undefined) {
      if (parentPost === null || parentPost === "null") {
        query.parentPost = null;
      } else {
        if (!/^[0-9a-fA-F]{24}$/.test(parentPost)) {
          return sendError(res, "Invalid parent post ID format", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
        }
        query.parentPost = parentPost;
      }
    } else if (topLevelOnly === "true") {
      query.parentPost = null;
    }

    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const posts = await Post.find(query)
      .populate("category", "name slug")
      .populate("parentPost", "title slug")
      .populate("brandingImage", "name imageUrl")
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Post.countDocuments(query);
    const pagination = createPaginationMeta(page, limit, total);

    return sendPaginated(res, posts, pagination, "Posts fetched successfully");
  } catch (error) {
    console.error("Error fetching posts:", error);
    return sendError(res, "Failed to fetch posts", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

async function getPost(req, res) {
  try {
    const { slug } = req.params;

    if (!slug || !slug.trim()) {
      return sendError(res, "Slug is required", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const post = await Post.findOne({ slug: slug.trim(), status: "published" })
      .populate("category", "name slug")
      .populate("parentPost", "title slug")
      .populate("brandingImage", "name imageUrl description")
      .lean();

    if (!post) {
      return sendError(res, "Post not found", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }

    const subposts = await Post.find({ parentPost: post._id, status: "published" })
      .populate("category", "name slug")
      .sort({ publishedAt: -1 })
      .lean();

    await Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } });

    return sendSuccess(res, { ...post, views: (post.views || 0) + 1, subposts }, "Post fetched successfully");
  } catch (error) {
    console.error("Error fetching post:", error);
    return sendError(res, "Failed to fetch post", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

async function createPost(req, res) {
  try {
    const postData = req.body;

    const existingPost = await Post.findOne({ slug: postData.slug });
    if (existingPost) {
      return sendError(res, "Post with this slug already exists", HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT);
    }

    if (postData.category) {
      const Category = require("../models/Category");
      const categoryExists = await Category.findById(postData.category);
      if (!categoryExists) {
        return sendError(res, "Category not found", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.NOT_FOUND);
      }
    }

    if (postData.parentPost) {
      if (!/^[0-9a-fA-F]{24}$/.test(postData.parentPost)) {
        return sendError(res, "Invalid parent post ID format", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
      }
      const parentPost = await Post.findById(postData.parentPost);
      if (!parentPost) {
        return sendError(res, "Parent post not found", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.NOT_FOUND);
      }
    }

    if (postData.contentBlocks && Array.isArray(postData.contentBlocks)) {
      postData.contentBlocks = postData.contentBlocks.map((block, index) => ({
        ...block,
        order: block.order !== undefined ? block.order : index,
        id: block.id || Math.random().toString(36).substring(2, 15),
      }));
    }

    if (!postData.content && (!postData.contentBlocks || postData.contentBlocks.length === 0)) {
      return sendError(res, "Either content or contentBlocks is required", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    if (postData.brandingImage) {
      const BrandingImage = require("../models/BrandingImage");
      const brandingImageExists = await BrandingImage.findById(postData.brandingImage);
      if (!brandingImageExists) {
        return sendError(res, "Branding image not found", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.NOT_FOUND);
      }
      await BrandingImage.findByIdAndUpdate(postData.brandingImage, {
        $inc: { usageCount: 1 },
        $set: { lastUsedAt: new Date() },
      });
    }

    const post = await Post.create(postData);
    const populatedPost = await Post.findById(post._id)
      .populate("category", "name slug")
      .populate("parentPost", "title slug")
      .populate("brandingImage", "name imageUrl")
      .lean();

    return sendSuccess(res, populatedPost, "Post created successfully", HTTP_STATUS.CREATED);
  } catch (error) {
    if (error.code === 11000) {
      return sendError(res, "Post with this slug already exists", HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT);
    }
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map((e) => e.message).join(", ");
      return sendError(res, message, HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_CODES.VALIDATION_ERROR);
    }
    console.error("Error creating post:", error);
    return sendError(res, "Failed to create post", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

async function updatePost(req, res) {
  try {
    const { id } = req.params;

    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return sendError(res, "Invalid post ID format", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const updateData = req.body;

    if (updateData.slug) {
      const existingPost = await Post.findOne({ slug: updateData.slug, _id: { $ne: id } });
      if (existingPost) {
        return sendError(res, "Post with this slug already exists", HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT);
      }
    }

    if (updateData.category) {
      const Category = require("../models/Category");
      const categoryExists = await Category.findById(updateData.category);
      if (!categoryExists) {
        return sendError(res, "Category not found", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.NOT_FOUND);
      }
    }

    if (updateData.parentPost !== undefined) {
      if (updateData.parentPost === null || updateData.parentPost === "") {
        updateData.parentPost = null;
      } else {
        if (!/^[0-9a-fA-F]{24}$/.test(updateData.parentPost)) {
          return sendError(res, "Invalid parent post ID format", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
        }
        if (updateData.parentPost === id) {
          return sendError(res, "A post cannot be its own parent", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
        }
        const parentPost = await Post.findById(updateData.parentPost);
        if (!parentPost) {
          return sendError(res, "Parent post not found", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.NOT_FOUND);
        }
        const currentPost = await Post.findById(id);
        if (currentPost && currentPost.parentPost && currentPost.parentPost.toString() === updateData.parentPost) {
          return sendError(res, "Post is already a child of this parent", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
        }
      }
    }

    if (updateData.brandingImage !== undefined) {
      if (updateData.brandingImage === null || updateData.brandingImage === "") {
        updateData.brandingImage = null;
      } else {
        if (!/^[0-9a-fA-F]{24}$/.test(updateData.brandingImage)) {
          return sendError(res, "Invalid branding image ID format", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
        }
        const BrandingImage = require("../models/BrandingImage");
        const brandingImageExists = await BrandingImage.findById(updateData.brandingImage);
        if (!brandingImageExists) {
          return sendError(res, "Branding image not found", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.NOT_FOUND);
        }
        await BrandingImage.findByIdAndUpdate(updateData.brandingImage, {
          $inc: { usageCount: 1 },
          $set: { lastUsedAt: new Date() },
        });
      }
    }

    if (updateData.contentBlocks && Array.isArray(updateData.contentBlocks)) {
      updateData.contentBlocks = updateData.contentBlocks.map((block, index) => ({
        ...block,
        order: block.order !== undefined ? block.order : index,
        id: block.id || Math.random().toString(36).substring(2, 15),
      }));
    }

    const post = await Post.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("category", "name slug")
      .populate("parentPost", "title slug")
      .populate("brandingImage", "name imageUrl");

    if (!post) {
      return sendError(res, "Post not found", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }

    return sendSuccess(res, post.toObject(), "Post updated successfully");
  } catch (error) {
    if (error.code === 11000) {
      return sendError(res, "Post with this slug already exists", HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT);
    }
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map((e) => e.message).join(", ");
      return sendError(res, message, HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_CODES.VALIDATION_ERROR);
    }
    console.error("Error updating post:", error);
    return sendError(res, "Failed to update post", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

async function deletePost(req, res) {
  try {
    const { id } = req.params;

    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return sendError(res, "Invalid post ID format", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const post = await Post.findById(id);
    if (!post) {
      return sendError(res, "Post not found", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }

    await Post.deleteOne({ _id: id });

    await Post.updateMany({ parentPost: id }, { $set: { parentPost: null } });

    return sendSuccess(res, { id: post._id }, "Post deleted successfully");
  } catch (error) {
    console.error("Error deleting post:", error);
    return sendError(res, "Failed to delete post", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

async function getSubposts(req, res) {
  try {
    const { id } = req.params;
    const { page, limit, skip } = parsePagination(req.query);

    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return sendError(res, "Invalid post ID format", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const parentPost = await Post.findById(id);
    if (!parentPost) {
      return sendError(res, "Parent post not found", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }

    const query = { parentPost: id, status: "published" };

    const subposts = await Post.find(query)
      .populate("category", "name slug")
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Post.countDocuments(query);
    const pagination = createPaginationMeta(page, limit, total);

    return sendPaginated(res, subposts, pagination, "Subposts fetched successfully");
  } catch (error) {
    console.error("Error fetching subposts:", error);
    return sendError(res, "Failed to fetch subposts", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getSubposts,
};
