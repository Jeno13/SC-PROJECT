const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: {
    type: String,
    required: true,
  },
  /**
   * Will accepts multiple types in future if needed
   * for now it will handle requests only
   */
  redirectsToType: {
    type: String,
    enum: ["requests"],
    default: "requests",
  },
  redirectsToId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  status: {
    type: String,
    enum: ["unread", "read"],
    default: "unread",
  }
}, { timestamps: true });

const Notification = mongoose.model("notification", NotificationSchema);

module.exports = Notification;
