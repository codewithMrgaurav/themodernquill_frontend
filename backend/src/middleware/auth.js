const { verifyToken } = require("../utils/jwt");
const User = require("../models/User");
const { sendError } = require("../utils/response");
const { HTTP_STATUS, ERROR_CODES } = require("../config/constants");

/**
 * Authentication middleware - reads JWT from cookies or Authorization header
 */
async function authenticate(req, res, next) {
  try {
    let token = null;

    // Try to get token from cookies first
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // Fallback to Authorization header
    else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.substring(7);
    }

    if (!token) {
      return sendError(res, "Authentication required", HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED);
    }

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return sendError(res, "Invalid or expired token", HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED);
    }

    // Get user from database
    const user = await User.findById(decoded.id).select("-password").lean();

    if (!user) {
      return sendError(res, "User not found", HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED);
    }

    if (!user.isActive) {
      return sendError(res, "Account is deactivated", HTTP_STATUS.FORBIDDEN, ERROR_CODES.FORBIDDEN);
    }

    // Attach user to request
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return sendError(res, "Authentication failed", HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED);
  }
}

/**
 * Optional authentication - doesn't fail if no token, but attaches user if token is valid
 */
async function optionalAuth(req, res, next) {
  try {
    let token = null;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.substring(7);
    }

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const user = await User.findById(decoded.id).select("-password").lean();
        if (user && user.isActive) {
          req.user = user;
          req.token = token;
        }
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
}

module.exports = {
  authenticate,
  optionalAuth,
};

