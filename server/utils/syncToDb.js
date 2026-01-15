import Url from "../models/Url.js";
import { redisClient } from "../utils/redisClient.js";

const syncToDb = async () => {
  try {
    const keys = await redisClient.keys("clickcount:*");
    // if (keys.length === 0) {
    //   console.log("No keys found in the redis");
    //   return;
    // }
    for (const key of keys) {
      const shorturl = key.split(":")[1];

      // Get click count value
      const count = await redisClient.get(key);

      // Update MongoDB
      await Url.updateOne(
        {
          shortString: shorturl,
        },
        {
          $inc: {
            noOfClicks: Number(count),
          },
        }
      );

      // Clear Redis counter after syncing
      await redisClient.del(key);
      console.log("Redis-to-MongoDB sync finished successfully.");
    }
  } catch (error) {
    console.log(error);
  }
};
export { syncToDb };
