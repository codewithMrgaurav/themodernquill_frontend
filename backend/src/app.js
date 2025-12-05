const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const apiRoutes = require("./routes/apiRoutes");
const { notFoundHandler, errorHandler } = require("./errors/errorHandler");
const logger = require("./middleware/logger");
const responseFormatter = require("./middleware/responseFormatter");

/**
 * Create and configure Express application
 */
function createApp() {
  const app = express();

  // Trust proxy (for rate limiting and IP detection behind reverse proxy)
  app.set("trust proxy", 1);

  // CORS Configuration - Allow all origins
  const corsOptions = {
    origin: function (origin, callback) {
      // Allow all origins in development, or if CORS_ORIGIN is set to "*"
      if (process.env.NODE_ENV !== "production" || process.env.CORS_ORIGIN === "*") {
        callback(null, true);
      } else if (process.env.CORS_ORIGIN) {
        // Allow specific origins from env
        const allowedOrigins = process.env.CORS_ORIGIN.split(",").map(o => o.trim());
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      } else {
        // Default: allow all in development
        callback(null, true);
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  };
  app.use(cors(corsOptions));

  // Cookie parser middleware
  app.use(cookieParser());

  // Body parsing middleware
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Serve static files (uploaded images)
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  // Request logging
  app.use(logger);

  // Response formatter
  app.use(responseFormatter);

  // Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "The Modern Quill API Documentation",
  }));

  // API Routes
  const apiVersion = process.env.API_VERSION || "v1";
  app.use(`/api/${apiVersion}`, apiRoutes);

  // Root endpoint
  app.get("/", (req, res) => {
    res.json({
      success: true,
      data: {
        message: "The Modern Quill API",
        version: apiVersion,
        documentation: "/api-docs",
        health: `/api/${apiVersion}/health`,
      },
      error: null,
    });
  });

  // 404 Handler
  app.use(notFoundHandler);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
