const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { createApp } = require("./app");

dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || "";

async function start() {
  const app = createApp();
  const server = http.createServer(app);

  if (!MONGODB_URI) {
    // eslint-disable-next-line no-console
    console.warn(
      "MONGODB_URI is not set. Backend will start without a database connection."
    );
  } else {
    try {
      await mongoose.connect(MONGODB_URI);
      // eslint-disable-next-line no-console
      console.log("Connected to MongoDB");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to connect to MongoDB:", error);
    }
  }

  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend server listening on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Fatal startup error:", error);
  process.exit(1);
});


