const User = require("../models/User");
const Newsletter = require("../models/Newsletter");
const { sendSuccess, sendError } = require("../utils/response");
const { HTTP_STATUS, ERROR_CODES } = require("../config/constants");
const { generateToken } = require("../utils/jwt");

async function login(req, res) {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return sendError(res, "Email is required", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const emailLower = email.trim().toLowerCase();

    // Find or create user
    let user = await User.findOne({ email: emailLower });

    if (!user) {
      // Create new user with email only
      user = await User.create({
        email: emailLower,
        name: emailLower.split("@")[0], // Use email prefix as default name
        password: "no-password", // Dummy password since it's required by schema
        isActive: true,
      });
    } else {
      // Update last login for existing user - use findByIdAndUpdate to avoid pre-save hook issues
      await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
    }

    // Subscribe to newsletter (create or update)
    let newsletter = await Newsletter.findOne({ email: emailLower });

    if (!newsletter) {
      // Create new newsletter subscription
      await Newsletter.create({
        email: emailLower,
        isActive: true,
        source: "login",
        subscribedAt: new Date(),
      });
    } else if (!newsletter.isActive) {
      // Reactivate existing subscription
      newsletter.isActive = true;
      newsletter.subscribedAt = new Date();
      newsletter.unsubscribedAt = null;
      await newsletter.save();
    }

    // Generate JWT token
    const token = generateToken(user);

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Prepare user response (without password)
    const userResponse = user.toObject();
    delete userResponse.password;

    return sendSuccess(res, { user: userResponse, token }, "Login successful");
  } catch (error) {
    console.error("Error during login:", error);
    if (error.code === 11000) {
      return sendError(res, "Email already exists", HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT);
    }
    return sendError(res, "Failed to login", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

async function logout(req, res) {
  try {
    // Clear token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });

    return sendSuccess(res, null, "Logout successful");
  } catch (error) {
    console.error("Error during logout:", error);
    return sendError(res, "Failed to logout", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

async function adminLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
      return sendError(res, "Email is required", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    if (!password || !password.trim()) {
      return sendError(res, "Password is required", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const emailLower = email.trim().toLowerCase();

    // Find user with password field
    const user = await User.findOne({ email: emailLower }).select("+password");

    if (!user) {
      return sendError(res, "Invalid email or password", HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED);
    }

    // Check if user is active
    if (!user.isActive) {
      return sendError(res, "Account is inactive", HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED);
    }

    // Verify password
    if (user.password && user.password !== "no-password") {
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return sendError(res, "Invalid email or password", HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED);
      }
    } else {
      // User doesn't have a password set, reject admin login
      return sendError(res, "Password not set for this account", HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED);
    }

    // Check if user is admin
    if (user.role !== "admin") {
      return sendError(res, "Access denied. Admin privileges required.", HTTP_STATUS.FORBIDDEN, ERROR_CODES.FORBIDDEN);
    }

    // Update last login - use findByIdAndUpdate to avoid pre-save hook issues
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() }, { new: true });

    // Generate JWT token
    const token = generateToken(user);

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Prepare user response (without password)
    const userResponse = user.toObject();
    delete userResponse.password;

    return sendSuccess(res, { user: userResponse, token }, "Admin login successful");
  } catch (error) {
    console.error("Error during admin login:", error);
    return sendError(res, "Failed to login", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

async function getCurrentUser(req, res) {
  try {
    // Get user from request (set by auth middleware)
    const user = req.user;

    if (!user) {
      return sendError(res, "User not found", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }

    return sendSuccess(res, user, "User fetched successfully");
  } catch (error) {
    console.error("Error fetching current user:", error);
    return sendError(res, "Failed to fetch user", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

module.exports = {
  login,
  adminLogin,
  logout,
  getCurrentUser,
};
