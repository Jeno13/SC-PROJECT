const Category = require("../models/Category");
const Project = require("../models/Project");
const User = require("../models/User");

const GET_HOME_VIEW = async (req, res) => {
  let data = {
    title: "Change",
  };

  try {
    // Get categories list
    const categories = await Category.find();

    // Get latest 25 projects
    const projects = await Project.find()
      .populate({ path: "category", select: "name", model: Category })
      .populate({ path: "user", select: ["name", "profilePicture"], model: User })
      .sort({ _id: -1 })
      .limit(25);

    // Pass categories and latest projects to view
    data.categories = categories;
    data.projects = projects;
  } catch (error) {
    data.categories = [];
    data.projects = [];
  }
  res.render("index", data);
};

const GET_SEARCH_VIEW = async (req, res) => {
  let data = {
    title: "Search",
  };

  // get the project query text
  const { project } = req.query;

  try {
    let results = [];

    if (project) {
      // Filter projects by query text
      results = await Project.find({
        title: { $regex: project, $options: "i" },
      })
        .populate({ path: "category", select: "name", model: Category })
        .populate({ path: "user", select: ["name", "profilePicture"], model: User })
        .sort({ _id: -1 });
    }

    data.results = results;
  } catch (error) {
    data.results = [];
  }

  data.title = `Search for ${project}`;
  data.project = project || "";

  return res.render("search", data);
};

module.exports = {
  GET_HOME_VIEW,
  GET_SEARCH_VIEW,
};
