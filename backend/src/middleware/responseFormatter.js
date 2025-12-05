/**
 * Response Formatter Middleware
 * Standardizes API response format
 */
function responseFormatter(req, res, next) {
  // Store original json method
  const originalJson = res.json;

  // Override json method
  res.json = function (data) {
    // If response already has success field, use as-is
    if (data && typeof data === "object" && "success" in data) {
      return originalJson.call(this, data);
    }

    // Format successful response
    const formattedResponse = {
      success: true,
      data: data,
      error: null,
    };

    return originalJson.call(this, formattedResponse);
  };

  next();
}

module.exports = responseFormatter;

