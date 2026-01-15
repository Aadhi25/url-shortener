import express from "express";
const router = express.Router();
import { createShortUrl, getGuestUrls } from "../controllers/urlController.js";
import { guestLimiter } from "../middleware/guestLimiter.js";
import { rateLimiter } from "../middleware/rateLimiter.js";

router.post(
  "/create-short-url",
  guestLimiter(2),
  rateLimiter({ limit: 10, windowInSec: 60 }),
  createShortUrl
);

router.get("/session-info", (req, res) => {
  return res.json({
    isAuthenticated: req.isAuthenticated(),
    urlCount: req.session.urlCount,
    limit: 2,
  });
});

router.get("/guest-urls", getGuestUrls);
export default router;
