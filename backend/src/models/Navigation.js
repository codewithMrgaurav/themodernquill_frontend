const mongoose = require("mongoose");

const navigationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional - can track anonymous users
      index: true,
    },
    page: {
      type: String,
      required: true,
      trim: true,
    },
    pageTitle: {
      type: String,
      trim: true,
    },
    referrer: {
      type: String,
      trim: true,
    },
    timeSpent: {
      type: Number, // Time in milliseconds
      default: 0,
    },
    visitStart: {
      type: Date,
      required: true,
      default: Date.now,
    },
    visitEnd: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

navigationSchema.index({ userId: 1, visitStart: -1 });
navigationSchema.index({ page: 1, visitStart: -1 });
navigationSchema.index({ visitStart: -1 });

module.exports = mongoose.model("Navigation", navigationSchema);

