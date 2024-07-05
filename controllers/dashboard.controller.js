const GET_DASHBOARD_HOME = (req, res) => {
    const data = {
      title: "Dashboard",
      layout: "./layouts/dashboard-layout",
    };
    res.render("dashboard", data);
  };

module.exports = {
  GET_DASHBOARD_HOME
}