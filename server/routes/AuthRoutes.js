const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/login", (req, res) => {
  res.send("Please log in");
});
router.get("/logout", logout);

module.exports = router;
