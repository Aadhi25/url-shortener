// src/app.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
// import cookieParser from "cookie-parser";
import { RedisStore } from "connect-redis";
import { redisClient } from "./utils/redisClient.js";
import { passportConfig } from "./config/passportStrategy.js";
import { checkAuthenticated } from "./middleware/checkAuth.js";

// Routes
import urlRoutes from "./routes/UrlRoutes.js";
import authRoutes from "./routes/AuthRoutes.js";
import userUrlRoutes from "./routes/UserUrlRoutes.js";

const app = express();
const isProduction = process.env.NODE_ENV === "production";

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
// app.options("*", cors());
// Passport config
passportConfig();

// app.use(cookieParser());

// Middleware
app.use(express.json());

// Session (uses redis, but DOES NOT connect it)
const redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
  ttl: 86400,
});

app.use(
  session({
    store: redisStore,
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    proxy: true,
    cookie: {
      secure: isProduction,
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log("🌐 Incoming:", req.method, req.path);
  next();
});
// Routes
app.use("/api/guest", urlRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", checkAuthenticated, userUrlRoutes);

export default app;
