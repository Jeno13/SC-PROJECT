const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    request: { type: mongoose.Schema.Types.ObjectId, ref: "Request" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: { type: String, required: true },
  },
  { timestamps: true }
);


const Message = mongoose.model("message", MessageSchema);

module.exports = Message;