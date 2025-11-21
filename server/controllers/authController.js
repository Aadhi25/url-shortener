const passport = require("passport");
const Auth = require("../models/Auth");
const validator = require("validator");

const register = async (req, res) => {
  // Get the user email and password
  const { email, password } = req.body;

  // Email validation
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Password validation
  if (!validator.isLength(password, { min: 8 })) {
    return res.status(400).json({
      error: "Password must be at least 8 characters long.",
    });
  }

  // Check if the user already exists or not in the database
  try {
    const checkUser = await Auth.findOne({
      email: email,
    });
    // if the user does not exist create a new user
    if (!checkUser) {
      const newUser = await Auth.create({
        email: email,
        password: password,
      });
      res.status(200).json(newUser);
    } else {
      res.status(200).send("You are already registered. Please log in");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Unable to register user. Try Again.");
  }
};

const login = async (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })(req, res, next);
};

const logout = async (req, res) => {
  req.logout(() => res.redirect("/login"));
};

module.exports = { register, login, logout };
