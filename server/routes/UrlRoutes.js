const express = require("express");
const router = express.Router();
const { postTrialUrl } = require("../controllers/urlController");

router.post("/", postTrialUrl);

module.exports = router;
