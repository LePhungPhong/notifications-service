// src/server.ts
import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import { connectMongo } from "./config/mongo.js";
import { initSocket } from "./sockets/notification.gateway.js";

dotenv.config();

const PORT = parseInt(process.env.PORT || "8080", 10);
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/notifications_db";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

async function start() {
  await connectMongo(MONGO_URI);

  const server = http.createServer(app);
  initSocket(server, CORS_ORIGIN === "*" ? "*" : CORS_ORIGIN.split(","));

  server.listen(PORT, () => {
    console.log(`Notifications service listening on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
