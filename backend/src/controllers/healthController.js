const mongoose = require("mongoose");
const { sendSuccess, sendError } = require("../utils/response");
const { HTTP_STATUS } = require("../config/constants");

/**
 * Health check endpoint
 */
async function getHealth(req, res) {
  try {
    const dbStatus = mongoose.connection.readyState;
    const dbStates = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    const healthData = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      database: {
        status: dbStates[dbStatus] || "unknown",
        connected: dbStatus === 1,
        name: mongoose.connection.db ? mongoose.connection.db.databaseName : null,
      },
    };

    return sendSuccess(res, healthData, "Service is healthy");
  } catch (error) {
    return sendError(res, "Health check failed", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  getHealth,
};

