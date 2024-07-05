/**
 * RedirectsIfNotAuthenticated middleware
 * Redirects to login page if user is not authenticated to protect other routes requires authenticated users
 * If user authenticated next() function will be fired to redirects to requested route
 *
 */

const RedirectsIfNotAuthenticated = async (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/login");
    return;
  }
  next();
};

module.exports = RedirectsIfNotAuthenticated;
