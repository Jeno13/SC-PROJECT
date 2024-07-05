const Notification = require("../models/Notification");

const GET_NOTIFICATIONS = async (req, res) => {
  const data = {
    title: "Notifications",
    layout: "./layouts/dashboard-layout",
  };

  try {
    // Get user notificaitons
    const notifications = await Notification.find({
      user: req.session.user.id,
    }).sort({ createdAt: -1 });

    data.notifications = notifications;
    res.render("dashboard/notifications", data);
  } catch (error) {
    return res.redirect("back");
  }
};

const POST_MARK_NOTIFICATION_AS_READ = async (req, res) => {
  const { id } = req.params;

  try {
    await Notification.findOneAndUpdate({ _id: id }, { status: "read" });

    req.flash("success", "Notification marked as read");

    return res.redirect("back");
  } catch (error) {
    return res.redirect("back");
  }
};

const DELETE_NOTIFICATION = async (req, res) => {
  const { id } = req.params;

  try {
    await Notification.deleteOne({ _id: id });

    req.flash("success", "Notification has been deleted");

    return res.redirect("back");
  } catch (error) {
    return res.redirect("back");
  }
};

module.exports = {
  GET_NOTIFICATIONS,
  POST_MARK_NOTIFICATION_AS_READ,
  DELETE_NOTIFICATION,
};
