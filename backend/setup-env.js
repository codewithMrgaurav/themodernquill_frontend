#!/usr/bin/env node

/**
 * Setup script to create .env file from .env.example
 */

const fs = require("fs");
const path = require("path");

const envExamplePath = path.join(__dirname, ".env.example");
const envPath = path.join(__dirname, ".env");

if (fs.existsSync(envPath)) {
  console.log("✅ .env file already exists");
  console.log("📝 Edit it manually if you need to change settings");
  process.exit(0);
}

if (!fs.existsSync(envExamplePath)) {
  console.error("❌ .env.example file not found");
  process.exit(1);
}

// Read .env.example
const envExample = fs.readFileSync(envExamplePath, "utf8");

// Write .env
fs.writeFileSync(envPath, envExample);

console.log("✅ Created .env file from .env.example");
console.log("📝 Please edit .env and add your MongoDB connection string:");
console.log("   MONGODB_URI=mongodb://localhost:27017/themodernquill");
console.log("");
console.log("💡 For MongoDB Atlas, use:");
console.log("   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/themodernquill");

