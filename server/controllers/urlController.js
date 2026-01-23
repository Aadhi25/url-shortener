import Url from "../models/Url.js";
import { redisClient } from "../utils/redisClient.js";
import { isValidUrl } from "../utils/isValidUrl.js";
import sanitizeHtml from "sanitize-html";

const createShortUrl = async (req, res) => {
  const { longUrl, shortUrl } = req.body;
  // Sanitize the url
  const sanitizedUrl = sanitizeHtml(longUrl, {
    allowedTags: [],
    allowedAttributes: {},
  });
  console.log("Before login session:", req.sessionID);
  try {
    const owner = req.user ? req.user._id : null;
    const sessionId = req.user ? null : req.sessionID;
    let findUrl;

    if (owner) {
      findUrl = await Url.findOne({
        longUrl: sanitizedUrl,
        owner: owner,
      });
    } else {
      findUrl = await Url.findOne({
        longUrl: sanitizedUrl,
        sessionId: sessionId,
      });
    }

    if (!isValidUrl(sanitizedUrl)) {
      return res.status(400).json({ message: "Please input a valid URL" });
    }

    if (findUrl) {
      console.log(findUrl);
      return res.status(200).json(findUrl);
    }

    if (!findUrl && isValidUrl(sanitizedUrl)) {
      let newShortUrl;
      if (owner) {
        newShortUrl = await Url.create({
          longUrl: sanitizedUrl,
          shortUrl: shortUrl,
          owner: req.user?._id,
        });
        return res.status(200).json(newShortUrl);
      } else {
        newShortUrl = await Url.create({
          longUrl: sanitizedUrl,
          shortUrl: shortUrl,
          sessionId: sessionId,
        });
        req.session.urlCount = (req.session.urlCount || 0) + 1;
        return res.status(200).json(newShortUrl);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: error.message,
    });
  }
};

const redirectUrl = async (req, res) => {
  console.log("REDIRECT HIT:", req.params.shorturl);
  const { shorturl } = req.params;
  const cached = await redisClient.get(`url:${shorturl}`);
  try {
    if (cached) {
      await redisClient.incr(`clickcount:${shorturl}`);
      console.log("From Redis Cache");
      return res.redirect(cached);
    }

    const urlFind = await Url.findOne({
      shortString: shorturl,
    }).lean();

    if (urlFind) {
      const validated = new URL(urlFind.longUrl);
      await redisClient.set(`url:${shorturl}`, validated.href);
      await redisClient.expire(`url:${shorturl}`, 86400);
      console.log("Stored successfully in redis.");

      // Real time click analytics
      const count = redisClient.incr(`clickcount:${shorturl}`);
      if (count === 1) {
        await redisClient.expire(`clickcount:${shorturl}`);
      }

      res.set({
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
      });

      return res.redirect(301, validated.href);
    } else {
      return res.json({ message: "Invalid url" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message });
  }
};

const statsUrl = async (req, res) => {
  try {
    // Get the urls and add it to redis key
    const shortUrls = await Url.find({ owner: req.user._id })
      .select("shortString noOfClicks")
      .lean();
    const keys = shortUrls.map((url) => {
      return `clickcount:${url.shortString}`;
    });
    const clicks = await redisClient.mGet(keys);
    const stats = shortUrls.map((url, idx) => {
      return {
        shortString: url.shortString,
        noOfClicks: url.noOfClicks + Number(clicks[idx]) || 0,
      };
    });

    return res.json(stats);
  } catch (error) {
    console.log(error);
  }
};

// Get all the url created by a specific user
const getUserUrls = async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    return res
      .status(400)
      .send("User id is mandatory to fetch all the urls created by the user.");
  }

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 10, 50);
  const skip = (page - 1) * limit;

  try {
    const [getAllUserUrls, total] = await Promise.all([
      Url.find({
        owner: userId,
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Url.countDocuments({ owner: userId }),
    ]);

    if (getAllUserUrls.length === 0) {
      return res
        .status(200)
        .json({ message: "No short urls are found for this user." });
    }

    const result = await Url.aggregate([
      {
        $match: { owner: userId },
      },
      {
        $group: {
          _id: null,
          totalClicks: { $sum: "$noOfClicks" },
        },
      },
    ]);

    const totalClicks = result[0]?.totalClicks || 0;

    return res.status(200).json({
      noOfUrls: total,
      totalClicksOfAllUrls: totalClicks,
      urls: getAllUserUrls,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching URLs by user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteUserUrl = async (req, res) => {
  const { urlId } = req.params;
  try {
    await Url.deleteOne({ _id: urlId }).lean();
    return res.json({
      message: "Deletion Successfull",
    });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Oops. Deletion Unsuccesful" });
  }
};

const getGuestUrls = async (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(400).json({ message: "You are not a guest user." });
  }

  try {
    const getUrls = await Url.find({
      sessionId: req.sessionID,
    }).lean();
    // console.log(getUrls);
    return res.json(getUrls || []);
  } catch (error) {
    console.error("Error message: ", error);
  }
};

export {
  createShortUrl,
  redirectUrl,
  statsUrl,
  getUserUrls,
  deleteUserUrl,
  getGuestUrls,
};
