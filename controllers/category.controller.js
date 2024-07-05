const Project = require("../models/Project");
const User = require("../models/User");
const Category = require("../models/Category");


const GET_PROJECTS_BY_CAEGORY = async (req, res) => {
  const {id} = req.params;

  const data = {
    layout: "./layouts/base-layout",
  };

  try {
    // Get category by ID
    const categoryDocument = await Category.findById(id);

    // If category not found redirect back to home page
    if (!categoryDocument) {
      res.redirect("/");
      return;
    }

    // Get projects by category ID
    const projects = await Project.find({category: id})
    .populate({ path: "category", select: "name", model: Category })
    .populate({ path: "user", select: ["name", "profilePicture"], model: User })
    .sort({ _id: -1 });

    // Set page title to category name
    data.title = categoryDocument.name;
    // pass projects list and category to view
    data.category = categoryDocument;
    data.projects = projects;
    res.render("category", data);
    return;
  } catch(error) {
    res.redirect("/");
    return;
  }
};

module.exports = {
  GET_PROJECTS_BY_CAEGORY,
};
