const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/api/auth/login");
  }
};

export { checkAuthenticated };
