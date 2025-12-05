const mongoose = require("mongoose");

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
async function connectDatabase() {
  let MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  // Ensure database name is included in connection string
  const urlModule = require("url");
  
  // Fix common URI format issues
  // If database name is in query string instead of path, fix it
  if (MONGODB_URI.includes("/?") || MONGODB_URI.match(/\/\?[^\/]+$/)) {
    // Extract database name from query string
    const match = MONGODB_URI.match(/\?\s*([^&?]+)/);
    if (match) {
      const dbName = match[1].trim();
      // Remove query string and add database name to path
      MONGODB_URI = MONGODB_URI.replace(/\?[^\/]*$/, `/${dbName}`);
      console.log(`🔧 Fixed URI format: database name moved from query to path`);
    }
  }
  
  let parsedUri;
  try {
    parsedUri = new urlModule.URL(MONGODB_URI);
  } catch (error) {
    throw new Error(`Invalid MongoDB URI format: ${error.message}`);
  }
  
  // If no database name in path, add default
  if (!parsedUri.pathname || parsedUri.pathname === "/") {
    const dbName = process.env.MONGODB_DB_NAME || "themodernquill";
    parsedUri.pathname = `/${dbName}`;
    MONGODB_URI = parsedUri.toString();
    console.log(`📝 Using database: ${dbName}`);
  } else {
    // Remove leading slash and log database name
    const dbName = parsedUri.pathname.replace(/^\//, "");
    console.log(`📝 Using database: ${dbName}`);
  }

  try {
    const options = {
      // Modern Mongoose connection options
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    await mongoose.connect(MONGODB_URI, options);

    const dbName = mongoose.connection.db.databaseName;
    const host = mongoose.connection.host;
    const port = mongoose.connection.port;
    
    console.log(`✅ Connected to MongoDB`);
    console.log(`📊 Database: ${dbName}`);
    console.log(`🔗 Host: ${host}${port ? `:${port}` : ""}`);

    // Connection event handlers
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("✅ MongoDB reconnected");
    });

    mongoose.connection.on("connecting", () => {
      console.log("🔄 Connecting to MongoDB...");
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    if (error.name === "MongoServerSelectionError") {
      console.error("💡 Tip: Make sure MongoDB is running and the connection string is correct");
    }
    throw error;
  }
}

/**
 * Disconnect from MongoDB database
 * @returns {Promise<void>}
 */
async function disconnectDatabase() {
  try {
    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ MongoDB disconnection error:", error.message);
    throw error;
  }
}

module.exports = {
  connectDatabase,
  disconnectDatabase,
};

