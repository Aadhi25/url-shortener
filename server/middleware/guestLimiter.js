const guestLimiter = (limit) => {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }

    if (!req.session.urlCount) {
      req.session.urlCount = 0;
    }

    if (req.session.urlCount >= limit) {
      return res.status(403).json({
        message:
          "You have reached the limit. Please log in to create more urls.",
      });
    }

    next();
  };
};

export { guestLimiter };
