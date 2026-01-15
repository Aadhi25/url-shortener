import { redisClient } from "../utils/redisClient.js";

function rateLimiter({ limit, windowInSec }) {
  return async (req, res, next) => {
    try {
      // Get the user id
      const userId = req.user ? req.user._id : req.sessionID;
      if (!userId)
        return res.status(401).json({
          message: "No requests",
        });
      const key = `rate:${userId}`;
      const count = await redisClient.incr(key);
      if (count === 1) {
        await redisClient.expire(key, windowInSec);
      }
      if (count > limit) {
        return res.status(429).json({
          error: "Too many requests. Please try again later.",
        });
      }
      next();
    } catch (error) {
      console.error("Rate limiter error:", error);
      next();
    }
  };
}
export { rateLimiter };
