// src/index.js
import mongoose from "mongoose";
import cron from "node-cron";
import * as http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import { syncToDb } from "./utils/syncToDb.js";
import { consumerFunc } from "./kafka/consumer.js";
import { producer } from "./kafka/producer.js";

const port = 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL },
});

await producer.connect();
console.log("✅ Kafka Producer Connected");
consumerFunc(io);

// MongoDB
await mongoose.connect(process.env.MONGO_CON_STRING);
console.log("MongoDB connected");

cron.schedule("*/2 * * * *", async () => {
  console.log("Cron running");
  await syncToDb();
});

// Server
server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
