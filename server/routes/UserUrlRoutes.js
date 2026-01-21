import express from "express";
const router = express.Router();
import { dashboard } from "../controllers/dashboardController.js";
import {
  createShortUrl,
  deleteUserUrl,
  getUserUrls,
  statsUrl,
} from "../controllers/urlController.js";
import { rateLimiter } from "../middleware/rateLimiter.js";

router.get("/dashboard", dashboard);
router.post(
  "/create-short-url",
  rateLimiter({ limit: 10, windowInSec: 60 }),
  createShortUrl,
);
router.get("/stats", statsUrl);
router.get("/get-url-by-user", getUserUrls);
router.delete("/delete-url/:urlId", deleteUserUrl);

export default router;
