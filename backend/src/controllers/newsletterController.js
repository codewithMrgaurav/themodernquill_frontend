const Newsletter = require("../models/Newsletter");
const { parsePagination, createPaginationMeta } = require("../utils/pagination");
const { sendPaginated, sendSuccess, sendError } = require("../utils/response");
const { HTTP_STATUS, ERROR_CODES } = require("../config/constants");
const { incrementSubscriptionCount } = require("../middleware/rateLimiter");

async function getSubscribers(req, res) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { isActive, search } = req.query;

    const query = {};

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    if (search && search.trim()) {
      query.email = { $regex: search.trim(), $options: "i" };
    }

    const subscribers = await Newsletter.find(query)
      .sort({ subscribedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Newsletter.countDocuments(query);
    const pagination = createPaginationMeta(page, limit, total);

    return sendPaginated(res, subscribers, pagination, "Subscribers fetched successfully");
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return sendError(res, "Failed to fetch subscribers", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

async function getSubscriber(req, res) {
  try {
    const { id } = req.params;

    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return sendError(res, "Invalid subscriber ID format", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const subscriber = await Newsletter.findById(id).lean();

    if (!subscriber) {
      return sendError(res, "Subscriber not found", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }

    return sendSuccess(res, subscriber, "Subscriber fetched successfully");
  } catch (error) {
    console.error("Error fetching subscriber:", error);
    return sendError(res, "Failed to fetch subscriber", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

async function subscribe(req, res) {
  try {
    const { email, source } = req.body;

    if (!email || !email.trim()) {
      return sendError(res, "Email is required", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const existingSubscriber = await Newsletter.findOne({ email: email.toLowerCase().trim() });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return sendError(res, "Email is already subscribed", HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT);
      } else {
        const updated = await Newsletter.findByIdAndUpdate(
          existingSubscriber._id,
          {
            isActive: true,
            source: source || existingSubscriber.source,
            subscribedAt: new Date(),
            unsubscribedAt: null,
          },
          { new: true }
        );

        // Increment rate limit counter only on successful resubscription
        if (req.clientIp) {
          incrementSubscriptionCount(req.clientIp);
        }

        return sendSuccess(res, updated.toObject(), "Successfully resubscribed", HTTP_STATUS.OK);
      }
    }

    const subscriber = await Newsletter.create({
      email: email.toLowerCase().trim(),
      source: source?.trim(),
      isActive: true,
      subscribedAt: new Date(),
    });

    // Increment rate limit counter only on successful subscription
    if (req.clientIp) {
      incrementSubscriptionCount(req.clientIp);
    }

    return sendSuccess(res, subscriber.toObject(), "Successfully subscribed to newsletter", HTTP_STATUS.CREATED);
  } catch (error) {
    if (error.code === 11000) {
      return sendError(res, "Email is already subscribed", HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT);
    }
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map((e) => e.message).join(", ");
      return sendError(res, message, HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_CODES.VALIDATION_ERROR);
    }
    console.error("Error subscribing:", error);
    return sendError(res, "Failed to subscribe", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

async function unsubscribe(req, res) {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return sendError(res, "Email is required", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const subscriber = await Newsletter.findOne({ email: email.toLowerCase().trim() });

    if (!subscriber) {
      return sendError(res, "Email not found in newsletter list", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }

    if (!subscriber.isActive) {
      return sendSuccess(res, subscriber.toObject(), "Email is already unsubscribed", HTTP_STATUS.OK);
    }

    const updated = await Newsletter.findByIdAndUpdate(
      subscriber._id,
      {
        isActive: false,
        unsubscribedAt: new Date(),
      },
      { new: true }
    );

    return sendSuccess(res, updated.toObject(), "Successfully unsubscribed from newsletter");
  } catch (error) {
    console.error("Error unsubscribing:", error);
    return sendError(res, "Failed to unsubscribe", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

async function updateSubscriber(req, res) {
  try {
    const { id } = req.params;

    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return sendError(res, "Invalid subscriber ID format", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const updateData = req.body;

    if (updateData.email) {
      const existing = await Newsletter.findOne({
        email: updateData.email.toLowerCase(),
        _id: { $ne: id },
      });
      if (existing) {
        return sendError(res, "Email already exists", HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT);
      }
      updateData.email = updateData.email.toLowerCase();
    }

    const subscriber = await Newsletter.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!subscriber) {
      return sendError(res, "Subscriber not found", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }

    return sendSuccess(res, subscriber.toObject(), "Subscriber updated successfully");
  } catch (error) {
    if (error.code === 11000) {
      return sendError(res, "Email already exists", HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT);
    }
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map((e) => e.message).join(", ");
      return sendError(res, message, HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_CODES.VALIDATION_ERROR);
    }
    console.error("Error updating subscriber:", error);
    return sendError(res, "Failed to update subscriber", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

async function deleteSubscriber(req, res) {
  try {
    const { id } = req.params;

    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return sendError(res, "Invalid subscriber ID format", HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const subscriber = await Newsletter.findByIdAndDelete(id);

    if (!subscriber) {
      return sendError(res, "Subscriber not found", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }

    return sendSuccess(res, { id: subscriber._id }, "Subscriber deleted successfully");
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    return sendError(res, "Failed to delete subscriber", HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR);
  }
}

module.exports = {
  getSubscribers,
  getSubscriber,
  subscribe,
  unsubscribe,
  updateSubscriber,
  deleteSubscriber,
};

