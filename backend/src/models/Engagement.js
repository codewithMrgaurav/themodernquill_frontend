const mongoose = require("mongoose");

const engagementSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["post_view", "url_click", "page_scroll", "batch"],
      index: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      index: true,
    },
    postSlug: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    referrer: {
      type: String,
      trim: true,
    },
    page: {
      type: String,
      trim: true,
    },
    scrollDepth: {
      type: Number,
      min: 0,
      max: 100,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

engagementSchema.index({ sessionId: 1, timestamp: -1 });
engagementSchema.index({ postId: 1, timestamp: -1 });
engagementSchema.index({ type: 1, timestamp: -1 });

module.exports = mongoose.model("Engagement", engagementSchema);

