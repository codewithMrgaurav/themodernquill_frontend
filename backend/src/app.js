const express = require("express");
const cors = require("cors");

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({
      success: true,
      data: { status: "ok" },
      error: null,
    });
  });

  // TODO: mount feature routers here, e.g. /api/posts, /api/categories, /api/ads

  // Fallback 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      data: null,
      error: {
        code: "NOT_FOUND",
        message: `Route ${req.method} ${req.path} not found`,
      },
    });
  });

  // Central error handler
  app.use((err, _req, res, _next) => {
    // eslint-disable-next-line no-console
    console.error("Unhandled error:", err);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong. Please try again later.",
      },
    });
  });

  return app;
}

module.exports = { createApp };


