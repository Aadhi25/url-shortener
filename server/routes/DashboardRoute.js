const express = require("express");
const router = express.Router();

router.get("/dashboard", (req, res, next) => {
  res.send("You have logged in and entered the dashboard");
  next();
});

module.exports = router;
