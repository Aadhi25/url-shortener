import express from "express";
const router = express.Router();
import {
  register,
  login,
  logout,
  verifyUser,
} from "../controllers/authController.js";

router.post("/register", register);
router.post("/verify-user", verifyUser);
router.post("/login", login);
router.get("/login", (req, res) => {
  res.send("Please log in");
});
router.get("/status", (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(200).json({ user: null });
    }
    res.status(200).json({
      user: {
        id: req.user._id,
        profileName: req.user.profileName,
        email: req.user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/logout", logout);

export default router;
