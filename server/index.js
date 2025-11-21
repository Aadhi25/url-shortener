const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");

// Routes
const urlRoutes = require("./routes/UrlRoutes");
const authRoutes = require("./routes/AuthRoutes");
const dashboardRoutes = require("./routes/DashboardRoute");

require("dotenv").config();
require("./config/passportStrategy");
app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

mongoose
  .connect(process.env.MONGO_CON_STRING)
  .then(() => {
    console.log("mongo connected");
  })
  .catch(() => {
    console.error;
  });

app.use("/trialurl", urlRoutes);
app.use("/", authRoutes);
app.use("/", dashboardRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
