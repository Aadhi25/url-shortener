import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false,
  },
});

redisClient.on("connect", () => {
  console.log("Redis connecting");
});

redisClient.on("ready", () => {
  console.log("Redis ready");
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

redisClient.on("end", () => {
  console.log("Redis disconnected");
});

await redisClient.connect();

export { redisClient };
