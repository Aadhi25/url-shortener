import { redisClient } from "../utils/redisClient.js";

function rateLimiter({ limit, windowInSec }) {
  return async (req, res, next) => {
    try {
      console.log("Rate limiter is hit: ", req.user);
      // Get the user id
      const userId = req.user._id;
      if (!userId)
        return res.status(401).json({
          message: "You are not logged in",
        });
      const key = `rate:${userId}`;
      const count = await redisClient.incr(key);
      if (count === 1) {
        await redisClient.expire(key, windowInSec);
      }
      if (count > limit) {
        return res.status(429).json({
          error: "Too many requests. Please try again after a minute.",
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
