const User = require("../models/User");
const { parsePagination, createPaginationMeta } = require("../utils/pagination");
const { sendPaginated, sendSuccess, sendError } = require("../utils/response");
const { HTTP_STATUS, ERROR_CODES } = require("../config/constants");

async function getUsers(req, res) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { role, isActive, search } = req.query;

    const query = {};

    if (role) {
      query.role = role;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { email: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await User.countDocuments(query);
    const pagination = createPaginationMeta(page, limit, total);

    return sendPaginated(res, users, pagination, "Users fetched successfully");
  } catch (error) {
    console.error("Error fetching users:", error);
    return sendError(res, "Failed to fetch users", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

async function getUser(req, res) {
  try {
    const { id } = req.params;

    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return sendError(res, "Invalid user ID format", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const user = await User.findById(id).select("-password").lean();

    if (!user) {
      return sendError(res, "User not found", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }

    return sendSuccess(res, user, "User fetched successfully");
  } catch (error) {
    console.error("Error fetching user:", error);
    return sendError(res, "Failed to fetch user", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

async function getUserByEmail(req, res) {
  try {
    const { email } = req.params;

    if (!email || !email.trim()) {
      return sendError(res, "Email is required", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("-password").lean();

    if (!user) {
      return sendError(res, "User not found", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }

    return sendSuccess(res, user, "User fetched successfully");
  } catch (error) {
    console.error("Error fetching user:", error);
    return sendError(res, "Failed to fetch user", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

async function createUser(req, res) {
  try {
    const userData = req.body;

    const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
    if (existingUser) {
      return sendError(res, "User with this email already exists", HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT);
    }

    const user = await User.create({
      ...userData,
      email: userData.email.toLowerCase(),
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    return sendSuccess(res, userResponse, "User created successfully", HTTP_STATUS.CREATED);
  } catch (error) {
    if (error.code === 11000) {
      return sendError(res, "User with this email already exists", HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT);
    }
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map((e) => e.message).join(", ");
      return sendError(res, message, HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_CODES.VALIDATION_ERROR);
    }
    console.error("Error creating user:", error);
    return sendError(res, "Failed to create user", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;

    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return sendError(res, "Invalid user ID format", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const updateData = req.body;

    if (updateData.email) {
      const existingUser = await User.findOne({
        email: updateData.email.toLowerCase(),
        _id: { $ne: id },
      });
      if (existingUser) {
        return sendError(res, "User with this email already exists", HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT);
      }
      updateData.email = updateData.email.toLowerCase();
    }

    if (updateData.password) {
      const existingUser = await User.findById(id).select("+password");
      if (!existingUser) {
        return sendError(res, "User not found", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
      }
    }

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return sendError(res, "User not found", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }

    return sendSuccess(res, user.toObject(), "User updated successfully");
  } catch (error) {
    if (error.code === 11000) {
      return sendError(res, "User with this email already exists", HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT);
    }
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map((e) => e.message).join(", ");
      return sendError(res, message, HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_CODES.VALIDATION_ERROR);
    }
    console.error("Error updating user:", error);
    return sendError(res, "Failed to update user", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return sendError(res, "Invalid user ID format", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return sendError(res, "User not found", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }

    return sendSuccess(res, { id: user._id }, "User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    return sendError(res, "Failed to delete user", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

module.exports = {
  getUsers,
  getUser,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
};

