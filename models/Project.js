const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a project title"],
  },
  description: {
    type: String,
    required: [true, "Please provide a project description"],
  },
  requirements: {
    type: String,
    required: [true, "Please provide a project requirements"],
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Please select category"],
  },
  attachment: {
    type: String,
  }
}, { timestamps: true });


const Project = mongoose.model("project", ProjectSchema);

module.exports = Project;
