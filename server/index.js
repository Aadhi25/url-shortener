// src/index.js
import "dotenv/config";
import mongoose from "mongoose";
import cron from "node-cron";

import app from "./app.js";
import { syncToDb } from "./utils/syncToDb.js";

const port = 3000;

// MongoDB
await mongoose.connect(process.env.MONGO_CON_STRING);
console.log("MongoDB connected");

cron.schedule("*/1 * * * *", async () => {
  console.log("Cron running");
  await syncToDb();
});

// Server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
