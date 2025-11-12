import express from "express";
import http from "http";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { connectMongo } from "./config/mongo.js";
import notifRoutes from "./routes/notification.routes.js";
import { initSocket } from "./sockets/notification.gateway.js";

dotenv.config();

const PORT = parseInt(process.env.PORT || "8080", 10);
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/notifications_db";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

async function main() {
  await connectMongo(MONGO_URI);
  const app = express();
  app.use(morgan("dev"));
  app.use(cors({ origin: CORS_ORIGIN === "*" ? true : CORS_ORIGIN.split(",") }));
  app.use(express.json());

  app.get("/", (_req, res) => res.json({ ok: true, service: process.env.SERVICE_NAME || "notifications-service" }));
  app.use("/api/notifications", notifRoutes);

  const server = http.createServer(app);
  initSocket(server, CORS_ORIGIN === "*" ? "*" : CORS_ORIGIN.split(","));

  server.listen(PORT, () => {
    console.log(`Notifications service listening on http://0.0.0.0:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
