/**
 * Request Logger Middleware
 */
function logger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const logMessage = {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get("user-agent"),
    };

    if (res.statusCode >= 400) {
      console.error("❌", logMessage);
    } else {
      console.log("✅", logMessage);
    }
  });

  next();
}

module.exports = logger;

