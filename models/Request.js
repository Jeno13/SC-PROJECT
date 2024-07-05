const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  sponsor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["pending", "accepted"],
    default: "pending",
  }
}, { timestamps: true });

const Request = mongoose.model("request", RequestSchema);

module.exports = Request;
