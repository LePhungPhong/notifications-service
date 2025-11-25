// src/server.ts
import app from "./app.js";
import { connectMongo } from "./config/mongo.js";

const PORT = Number(process.env.PORT);
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/notifications_db";

async function start() {
  await connectMongo(MONGO_URI);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Notifications service listening on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
