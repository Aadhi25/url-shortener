const Url = require("../models/Url");

const postTrialUrl = async (req, res) => {
  const { longUrl, shortUrl, noOfClicks } = req.body;
  try {
    const findUrl = await Url.findOne({
      longUrl: longUrl,
      // shortUrl: req.body.shortUrl,
    });
    const isValidUrl = (url) => {
      try {
        new URL(url);
        return true;
      } catch (error) {
        return false;
      }
    };

    if (!isValidUrl(longUrl)) {
      res.status(400).send("Please input a valid URL");
    }

    if (!findUrl && isValidUrl(longUrl)) {
      const newShortUrl = await Url.create({
        longUrl,
        shortUrl,
        noOfClicks,
      });
      res.status(200).json(newShortUrl);
      console.log(newShortUrl);
    } else {
      res.status(200).json(findUrl);
      console.log(findUrl);
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
    console.log(error);
  }
};

module.exports = {
  postTrialUrl,
};
