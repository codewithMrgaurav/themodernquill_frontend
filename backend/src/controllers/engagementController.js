const Engagement = require("../models/Engagement");
const { sendSuccess, sendError } = require("../utils/response");
const { HTTP_STATUS, ERROR_CODES } = require("../config/constants");

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

async function trackEngagement(req, res) {
  try {
    const { type, postId, postSlug, url, referrer, page, scrollDepth, data, sessionId, timestamp } = req.body;

    if (!type) {
      return sendError(res, "Engagement type is required", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const clientIp = getClientIp(req);
    const userAgent = req.headers["user-agent"] || "";

    if (type === "batch" && data) {
      // Handle batch engagement data
      const engagementRecords = [];

      // Process post views
      if (data.postViews) {
        for (const [postId, count] of Object.entries(data.postViews)) {
          for (let i = 0; i < count; i++) {
            engagementRecords.push({
              sessionId: sessionId || `session_${Date.now()}`,
              type: "post_view",
              postId: postId,
              timestamp: new Date(data.lastActivity || Date.now()),
              ipAddress: clientIp,
              userAgent: userAgent,
            });
          }
        }
      }

      // Process URL clicks
      if (data.urlClicks && Array.isArray(data.urlClicks)) {
        data.urlClicks.forEach((click) => {
          engagementRecords.push({
            sessionId: sessionId || `session_${Date.now()}`,
            type: "url_click",
            url: click.url,
            referrer: click.referrer,
            timestamp: new Date(click.timestamp || Date.now()),
            ipAddress: clientIp,
            userAgent: userAgent,
          });
        });
      }

      // Process page scrolls
      if (data.pageScrolls && Array.isArray(data.pageScrolls)) {
        data.pageScrolls.forEach((scroll) => {
          engagementRecords.push({
            sessionId: sessionId || `session_${Date.now()}`,
            type: "page_scroll",
            page: scroll.page,
            scrollDepth: scroll.scrollDepth,
            timestamp: new Date(scroll.timestamp || Date.now()),
            ipAddress: clientIp,
            userAgent: userAgent,
          });
        });
      }

      if (engagementRecords.length > 0) {
        await Engagement.insertMany(engagementRecords, { ordered: false });
      }

      return sendSuccess(res, { tracked: engagementRecords.length }, "Engagement tracked successfully");
    } else {
      // Handle single engagement event
      const engagementData = {
        sessionId: sessionId || `session_${Date.now()}`,
        type,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        ipAddress: clientIp,
        userAgent: userAgent,
      };

      if (postId) engagementData.postId = postId;
      if (postSlug) engagementData.postSlug = postSlug;
      if (url) engagementData.url = url;
      if (referrer) engagementData.referrer = referrer;
      if (page) engagementData.page = page;
      if (scrollDepth !== undefined) engagementData.scrollDepth = scrollDepth;
      if (data) engagementData.data = data;

      const engagement = await Engagement.create(engagementData);

      // If it's a post view, increment the post's view count
      if (type === "post_view" && postId) {
        try {
          const Post = require("../models/Post");
          await Post.findByIdAndUpdate(postId, { $inc: { views: 1 } });
        } catch (error) {
          console.error("Error incrementing post views:", error);
        }
      }

      return sendSuccess(res, engagement.toObject(), "Engagement tracked successfully", HTTP_STATUS.CREATED);
    }
  } catch (error) {
    console.error("Error tracking engagement:", error);
    return sendError(res, "Failed to track engagement", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

async function getEngagementStats(req, res) {
  try {
    const { postId, sessionId, type, startDate, endDate } = req.query;

    const query = {};

    if (postId) {
      query.postId = postId;
    }

    if (sessionId) {
      query.sessionId = sessionId;
    }

    if (type) {
      query.type = type;
    }

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) {
        query.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        query.timestamp.$lte = new Date(endDate);
      }
    }

    const stats = {
      totalViews: await Engagement.countDocuments({ ...query, type: "post_view" }),
      totalClicks: await Engagement.countDocuments({ ...query, type: "url_click" }),
      totalScrolls: await Engagement.countDocuments({ ...query, type: "page_scroll" }),
      uniqueSessions: await Engagement.distinct("sessionId", query).then((sessions) => sessions.length),
    };

    return sendSuccess(res, stats, "Engagement stats fetched successfully");
  } catch (error) {
    console.error("Error fetching engagement stats:", error);
    return sendError(res, "Failed to fetch engagement stats", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

module.exports = {
  trackEngagement,
  getEngagementStats,
};

