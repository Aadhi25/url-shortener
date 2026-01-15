import express from "express";
const app = express();
const port = 3000;
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import Razorpay from "razorpay";
import { redisClient } from "./utils/redisClient.js";
import { checkAuthenticated } from "./middleware/checkAuth.js";
import { RedisStore } from "connect-redis";
import { syncToDb } from "./utils/syncToDb.js";
import cron from "node-cron";

// Routes
import urlRoutes from "./routes/UrlRoutes.js";
import authRoutes from "./routes/AuthRoutes.js";
import userUrlRoutes from "./routes/UserUrlRoutes.js";
import paymentRoutes from "./routes/PaymentRoutes.js";

import "dotenv/config";
import { passportConfig } from "./config/passportStrategy.js";

passportConfig();
// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
  ttl: 86400,
});
app.use(express.json());
app.use(
  session({
    store: redisStore,
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
      // maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: "http://localhost:5173", // Vite frontend
    credentials: true,
  })
);
mongoose
  .connect(process.env.MONGO_CON_STRING)
  .then(() => {
    console.log("mongo connected");
  })
  .catch(() => {
    console.error;
  });
app.use("/api/guest", urlRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", checkAuthenticated, userUrlRoutes);
app.use("/api/user/payments", checkAuthenticated, paymentRoutes);

// Razorpay config
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

// Schedule a cron job that updates the database every 8 minutes.

cron.schedule("*/1 * * * *", async () => {
  console.log("cron running");
  await syncToDb();
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
