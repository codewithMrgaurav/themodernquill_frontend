const Navigation = require("../models/Navigation");
const { sendSuccess, sendError } = require("../utils/response");
const { HTTP_STATUS, ERROR_CODES } = require("../config/constants");

async function trackNavigation(req, res) {
  try {
    const { page, pageTitle, referrer, timeSpent, metadata } = req.body;

    if (!page || !page.trim()) {
      return sendError(res, "Page is required", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    // Get user from request (set by optionalAuth middleware)
    const userId = req.user?._id;

    const navigationData = {
      userId: userId || null, // Optional - can track anonymous users
      page: page.trim(),
      pageTitle: pageTitle?.trim(),
      referrer: referrer?.trim(),
      timeSpent: timeSpent || 0,
      visitStart: new Date(Date.now() - (timeSpent || 0)), // Visit started timeSpent ms ago
      visitEnd: new Date(),
      metadata: metadata || {},
    };

    const navigation = await Navigation.create(navigationData);

    return sendSuccess(res, navigation.toObject(), "Navigation tracked successfully", HTTP_STATUS.CREATED);
  } catch (error) {
    console.error("Error tracking navigation:", error);
    return sendError(res, "Failed to track navigation", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

async function getUserNavigation(req, res) {
  try {
    const userId = req.user?._id || req.params?.userId;

    if (!userId) {
      return sendError(res, "User ID is required", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const { page, startDate, endDate, limit = 100 } = req.query;

    const query = { userId };

    if (page) {
      query.page = page;
    }

    if (startDate || endDate) {
      query.visitStart = {};
      if (startDate) {
        query.visitStart.$gte = new Date(startDate);
      }
      if (endDate) {
        query.visitStart.$lte = new Date(endDate);
      }
    }

    const navigations = await Navigation.find(query)
      .sort({ visitStart: -1 })
      .limit(parseInt(limit))
      .lean();

    return sendSuccess(res, navigations, "Navigation history fetched successfully");
  } catch (error) {
    console.error("Error fetching navigation:", error);
    return sendError(res, "Failed to fetch navigation", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

async function getNavigationStats(req, res) {
  try {
    const userId = req.user?._id || req.params?.userId;

    if (!userId) {
      return sendError(res, "User ID is required", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const { startDate, endDate } = req.query;

    const query = { userId };

    if (startDate || endDate) {
      query.visitStart = {};
      if (startDate) {
        query.visitStart.$gte = new Date(startDate);
      }
      if (endDate) {
        query.visitStart.$lte = new Date(endDate);
      }
    }

    const stats = {
      totalVisits: await Navigation.countDocuments(query),
      totalTimeSpent: await Navigation.aggregate([
        { $match: query },
        { $group: { _id: null, total: { $sum: "$timeSpent" } } },
      ]).then((result) => (result[0]?.total || 0) / 1000 / 60), // Convert to minutes
      uniquePages: await Navigation.distinct("page", query).then((pages) => pages.length),
      mostVisitedPages: await Navigation.aggregate([
        { $match: query },
        { $group: { _id: "$page", count: { $sum: 1 }, totalTime: { $sum: "$timeSpent" } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    };

    return sendSuccess(res, stats, "Navigation stats fetched successfully");
  } catch (error) {
    console.error("Error fetching navigation stats:", error);
    return sendError(res, "Failed to fetch navigation stats", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

module.exports = {
  trackNavigation,
  getUserNavigation,
  getNavigationStats,
};

