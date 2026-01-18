import express from "express";
const router = express.Router();
import {
  register,
  login,
  logout,
  verifyUser,
  authGoogle,
  authGoogleCallback,
  deleteAccount,
} from "../controllers/authController.js";
import { checkAuthenticated } from "../middleware/checkAuth.js";
import passport from "passport";

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
router.get(
  "/google",
  (req, res, next) => {
    // this temp cookie is needed because when the oauth redirect happens the req.sessionID changes
    res.cookie("tempSessionID", req.sessionID);
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  authGoogleCallback
);
router.post("/logout", logout);
router.delete("/delete-account", checkAuthenticated, deleteAccount);

export default router;
