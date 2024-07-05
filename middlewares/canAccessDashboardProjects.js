/**
 * canAccessDashboardProjects middleware
 * Check if current user acn access dashboard projects if type is student
 *
 */
const CanAccessDashboardProjects = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/");
  }

  if (req.session.user.type !== "student") {
    return res.redirect("/dashboard");
  }
  
  next();
};

module.exports = CanAccessDashboardProjects;
