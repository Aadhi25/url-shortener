// The dashboard should have all the short url created by the user
// Every url should have the number of times it is clicked
const dashboard = async (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log(req.user);
    res.send("You have logged in and entered the dashboard");
  } else {
    res.redirect("/api/auth/login");
  }
  next();
};
export { dashboard };
