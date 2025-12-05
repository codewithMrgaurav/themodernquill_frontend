const http = require("http");
const dotenv = require("dotenv");
const { createApp } = require("./app");
const { connectDatabase, disconnectDatabase } = require("./config/database");

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || "development";

/**
 * Graceful shutdown handler
 */
function setupGracefulShutdown(server) {
  const shutdown = async (signal) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);

    server.close(async () => {
      console.log("HTTP server closed");

      try {
        await disconnectDatabase();
        console.log("✅ Graceful shutdown completed");
        process.exit(0);
      } catch (error) {
        console.error("❌ Error during shutdown:", error);
        process.exit(1);
      }
    });

    // Force close after 10 seconds
    setTimeout(() => {
      console.error("⚠️ Forcing shutdown after timeout");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (err) => {
    console.error("❌ Unhandled Promise Rejection:", err);
    shutdown("UNHANDLED_REJECTION");
  });

  // Handle uncaught exceptions
  process.on("uncaughtException", (err) => {
    console.error("❌ Uncaught Exception:", err);
    shutdown("UNCAUGHT_EXCEPTION");
  });
}

/**
 * Start the server
 */
async function start() {
  try {
    // Connect to database
    if (process.env.MONGODB_URI) {
      await connectDatabase();
    } else {
      console.warn(
        "⚠️ MONGODB_URI is not set. Backend will start without a database connection."
      );
    }

    // Create Express app
    const app = createApp();
    const server = http.createServer(app);

    // Setup graceful shutdown
    setupGracefulShutdown(server);

    // Start server
    server.listen(PORT, () => {
      const dbStatus = process.env.MONGODB_URI ? "✅ Connected" : "⚠️ Not connected";
      console.log(`
🚀 Server is running!
   Environment: ${NODE_ENV}
   Port: ${PORT}
   Database: ${dbStatus}
   API: http://localhost:${PORT}/api/${process.env.API_VERSION || "v1"}
   Swagger: http://localhost:${PORT}/api-docs
      `);
    });
  } catch (error) {
    console.error("❌ Fatal startup error:", error);
    process.exit(1);
  }
}

// Start the application
start();
