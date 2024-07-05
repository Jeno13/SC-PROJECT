/**
 * RedirectsIfAuthenticated middleware
 * Redirects to home page if user is already authenticated to protect auth routes
 * If user not authenticated next() function will be fired to redirects to requested auth routes
 *
 */
const RedirectsIfAuthenticated = (req, res, next) => {
  if (req.session.user) {
    res.redirect("/");
    return;
  }
  next();
};

module.exports = RedirectsIfAuthenticated;
