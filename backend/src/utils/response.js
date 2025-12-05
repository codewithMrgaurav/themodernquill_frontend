const { HTTP_STATUS } = require("../config/constants");

/**
 * Send success response
 */
function sendSuccess(res, data, message = null, statusCode = HTTP_STATUS.OK) {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
    error: null,
  });
}

/**
 * Send error response
 */
function sendError(res, message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errorCode = null) {
  return res.status(statusCode).json({
    success: false,
    data: null,
    message,
    error: {
      code: errorCode || "ERROR",
      message,
    },
  });
}

/**
 * Send paginated response
 */
function sendPaginated(res, data, pagination, message = null) {
  return res.status(HTTP_STATUS.OK).json({
    success: true,
    data,
    pagination,
    message,
    error: null,
  });
}

module.exports = {
  sendSuccess,
  sendError,
  sendPaginated,
};

