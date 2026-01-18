import passport from "passport";
import Auth from "../models/Auth.js";
import Url from "../models/Url.js";
import { sendVerifyEmail } from "../utils/verifyEmail.js";
import validator from "validator";
import crypto from "crypto";

const register = async (req, res) => {
  // Get the user email and password
  const { profileName, email, password, isVerified } = req.body;
  // Email validation
  if (!validator.isEmail(email)) {
    return res.status(400).json({
      error: "Invalid email format",
    });
  }

  // Password validation
  if (
    !validator.isLength(password, {
      min: 8,
    })
  ) {
    return res.status(400).json({
      error: "Password must be at least 8 characters long.",
    });
  }

  // Check if the user already exists or not in the database
  try {
    const checkUser = await Auth.findOne({
      email: email,
    });
    if (checkUser) {
      return res
        .status(400)
        .json({ message: "You are already registered. Please log in" });
    }

    if (!checkUser) {
      const newUser = await Auth.create({
        profileName: profileName,
        email: email,
        password: password,
        isVerified: isVerified,
      });

      const token = crypto.randomBytes(64).toString("hex");
      const hashed = crypto.createHash("sha256").update(token).digest("hex");

      newUser.verifyToken = hashed;
      newUser.verifyTokenExpiry = Date.now() + 60 * 60 * 1000;
      await newUser.save();

      const verifyUrl = `${process.env.FRONTEND_URL}/auth/verify-user?token=${token}`;

      if (process.env.NODE_ENV !== "test") {
        await sendVerifyEmail(newUser.email, verifyUrl);
      }
      return res.status(200).json(newUser);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Unable to register user. Try Again.");
  }
};

const verifyUser = async (req, res) => {
  // Get the token
  const { token } = req.body;

  // Verify the token and update the verification to true in database
  const hashed = crypto.createHash("sha256").update(token).digest("hex");
  console.log(hashed);
  const findUser = await Auth.findOne({
    verifyToken: hashed,
    verifyTokenExpiry: { $gt: Date.now() },
  });

  if (!findUser) {
    return res.status(400).json({ message: "Invalid Token" });
  }

  findUser.isVerified = true;
  findUser.verifyToken = undefined;
  findUser.verifyTokenExpiry = undefined;

  await findUser.save();

  return res.json({
    message: "Verification successful.",
  });
};

const login = async (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({
        message: info?.message || "Unable to login",
      });
    }
    try {
      await Url.updateMany(
        {
          sessionId: req.sessionID,
          owner: null,
        },
        {
          $set: {
            owner: user._id,
            sessionId: null,
          },
        }
      );

      req.session.urlCount = 0;
    } catch (error) {
      console.log(error);
    }

    req.logIn(user, (err) => {
      if (err) return next(err);

      if (user.isVerified === false) {
        return res
          .status(400)
          .json({ message: "Please verify your email address to login." });
      }

      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
          profileName: user.profileName,
        },
      });
    });
  })(req, res, next);
};

const authGoogle = passport.authenticate("google", {
  scope: ["profile", "email"],
});

const authGoogleCallback = async (req, res, next) => {
  passport.authenticate("google", { failureRedirect: "/api/auth/login" })(
    req,
    res,
    () => {
      // console.log("GOOGLE LOGIN SUCCESS:", req.user.email);
      res.redirect("http://localhost:5173/dashboard");
    }
  );
};

const logout = async (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ message: "Signed Out" });
    });
  });
};

const deleteAccount = async (req, res) => {
  const userId = req.user._id;
  console.log(userId);
  try {
    // delete user and urls created by the user
    await Url.deleteMany({ owner: userId });
    await Auth.deleteOne({ _id: userId });

    // delete the current session by logging out the user
    req.logout(() => {
      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.json({ message: "Account deleted." });
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export {
  register,
  login,
  logout,
  verifyUser,
  authGoogle,
  authGoogleCallback,
  deleteAccount,
};
