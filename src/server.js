import http from "node:http";
import { createApp } from "./app.js";
import { env } from "./lib/config/env.js";
import { logger } from "./pkg/logger/logger.js";
import mongoose from "mongoose";
const PORT = env.port || 5000;
const app = createApp();
const server = http.createServer(app);
function shutdown() {
  logger.info("shutting down");
  server.close(async () => {
    await mongoose.disconnect();
    process.exit(0);
  });
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
server.listen(PORT, () => logger.info(`this app is running on port ${PORT}`));
