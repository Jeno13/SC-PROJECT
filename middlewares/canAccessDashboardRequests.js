/**
 * canAccessDashboardRequests middleware
 * Check if current user can access dashboard requests if type is sponsor
 *
 */
const CanAccessDashboardRequests = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  if (req.session.user.type !== "sponsor") {
    return res.redirect("/dashboard");
  }
  next();
};

module.exports = CanAccessDashboardRequests;
