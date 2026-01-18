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
  try {
    const findUrl = await Url.findOne({
      longUrl: sanitizedUrl,
      owner: req.user ? req.user._id : null,
      sessionId: req.user ? null : req.sessionID,
    });

    if (!req.user) {
      req.session.urlCount = (req.session.urlCount || 0) + 1;
    }
    if (!isValidUrl(sanitizedUrl)) {
      return res.status(400).json({ message: "Please input a valid URL" });
    }

    if (!findUrl && isValidUrl(sanitizedUrl)) {
      const newShortUrl = await Url.create({
        longUrl: sanitizedUrl,
        shortUrl,
        owner: req.user?._id || null,
        sessionId: req.user ? null : req.sessionID,
      });
      console.log(newShortUrl);
      return res.status(200).json(newShortUrl);
    } else {
      console.log(findUrl);
      return res.status(200).json(findUrl);
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
    });

    if (urlFind) {
      const validated = new URL(urlFind.longUrl);
      await redisClient.set(`url:${shorturl}`, validated.href);
      await redisClient.expire(`url:${shorturl}`, 86400);
      console.log("Stored successfully in redis.");

      // Real time click analytics
      // .then is used because for redirects await does not execute fully
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

      return res.redirect(307, validated.href);
    } else {
      return res.send("Invalid url");
    }
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message });
  }
};

const statsUrl = async (req, res) => {
  const { shorturl } = req.params;

  try {
    const urlFind = await Url.findOne({
      shortString: shorturl,
    });

    if (urlFind) {
      const clickCount = await redisClient.get(`clickcount:${shorturl}`);

      return res.json({
        longUrl: urlFind.longUrl,
        shortUrl: shorturl,
        noOfClicks: Number(clickCount || 0),
      });
    }
    return res.send("No url found");
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
      return res.status(400).send("No short urls are found for this user.");
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
    await Url.deleteOne({ _id: urlId });
    return res.json({
      message: "Deletion Successfull",
    });
  } catch (error) {
    console.log(error);
  }
};

const getGuestUrls = async (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(400).json({ message: "You are not a guest user." });
  }
  try {
    const getUrls = await Url.find({
      sessionId: req.sessionID,
    });
    console.log(getUrls);
    return res.json(getUrls);
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
