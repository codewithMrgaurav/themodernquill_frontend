const { sendError } = require("../utils/response");
const { HTTP_STATUS, ERROR_CODES } = require("../config/constants");

// In-memory store for IP-based rate limiting
// In production, consider using Redis for distributed systems
const ipSubscriptionCount = new Map();
const IP_RESET_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const MAX_SUBSCRIPTIONS_PER_IP = 3;

/**
 * Clean up old IP entries periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ipSubscriptionCount.entries()) {
    if (now - data.firstSubscription > IP_RESET_INTERVAL) {
      ipSubscriptionCount.delete(ip);
    }
  }
}, 60 * 60 * 1000); // Clean up every hour

/**
 * Get client IP address from request
 */
function getClientIp(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip ||
    "unknown"
  );
}

/**
 * Rate limiter for newsletter subscriptions
 * Allows maximum 3 subscriptions per IP address
 * Only checks the limit, doesn't increment (increment happens on success)
 */
function newsletterRateLimiter(req, res, next) {
  const clientIp = getClientIp(req);

  if (clientIp === "unknown") {
    return sendError(
      res,
      "Unable to determine IP address",
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.VALIDATION_ERROR
    );
  }

  const now = Date.now();
  const ipData = ipSubscriptionCount.get(clientIp);

  if (!ipData) {
    // First subscription attempt from this IP - allow it
    // Count will be incremented on successful subscription
    req.clientIp = clientIp;
    return next();
  }

  // Check if 24 hours have passed since first subscription
  if (now - ipData.firstSubscription > IP_RESET_INTERVAL) {
    // Reset the counter - allow this attempt
    req.clientIp = clientIp;
    return next();
  }

  // Check if limit exceeded
  if (ipData.count >= MAX_SUBSCRIPTIONS_PER_IP) {
    const hoursRemaining = Math.ceil(
      (IP_RESET_INTERVAL - (now - ipData.firstSubscription)) / (60 * 60 * 1000)
    );
    return sendError(
      res,
      `Maximum subscription limit reached (${MAX_SUBSCRIPTIONS_PER_IP} per 24 hours). You can subscribe again after ${hoursRemaining} hour(s).`,
      HTTP_STATUS.TOO_MANY_REQUESTS,
      "RATE_LIMIT_EXCEEDED"
    );
  }

  // Limit not exceeded - allow request
  // Attach IP to request for incrementing on success
  req.clientIp = clientIp;
  next();
}

/**
 * Increment subscription count after successful subscription
 * This should be called only after a successful subscription
 */
function incrementSubscriptionCount(clientIp) {
  if (!clientIp || clientIp === "unknown") {
    return;
  }

  const now = Date.now();
  const ipData = ipSubscriptionCount.get(clientIp);

  if (!ipData) {
    // First successful subscription from this IP
    ipSubscriptionCount.set(clientIp, {
      count: 1,
      firstSubscription: now,
      lastSubscription: now,
    });
  } else {
    // Check if 24 hours have passed - reset if so
    if (now - ipData.firstSubscription > IP_RESET_INTERVAL) {
      ipSubscriptionCount.set(clientIp, {
        count: 1,
        firstSubscription: now,
        lastSubscription: now,
      });
    } else {
      // Increment existing count
      ipData.count += 1;
      ipData.lastSubscription = now;
      ipSubscriptionCount.set(clientIp, ipData);
    }
  }
}

/**
 * Get subscription count for an IP (for debugging/admin purposes)
 */
function getSubscriptionCount(ip) {
  const ipData = ipSubscriptionCount.get(ip);
  return ipData ? ipData.count : 0;
}

module.exports = {
  newsletterRateLimiter,
  incrementSubscriptionCount,
  getSubscriptionCount,
};

