const Project = require("../models/Project");
const Category = require("../models/Category");
const User = require("../models/User");
const Request = require("../models/Request");
const mongoose = require("mongoose");
const fs = require("fs");

// Dashboard routes controllers
const GET_PROJECTS_LIST = async (req, res) => {
  const data = {
    title: "Projects",
    layout: "./layouts/dashboard-layout",
  };

  try {
    /**
     * Get current user projects from DB with populating category object from reference
     *
     * We can use the below basic query to get projects without requests.
     * const projects = await Project.find({ user: req.session.user.id }).sort({ createdAt: -1 }).populate({ path: "category", select: "name", model: Category });
     * To get projects with requests we should use aggregate
     */

    const projects = await Project.aggregate([
      // Get projects for current user only = where user.id = current user id
      {
        $match: {
          user: mongoose.Types.ObjectId.createFromHexString(
            req.session.user.id
          ),
        },
      },
      // Relation with category collection
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      // Relation with category collection
      {
        $unwind: "$category",
      },
      // Relation with requests collection
      {
        $lookup: {
          from: "requests",
          localField: "_id",
          foreignField: "project",
          as: "requests",
        },
      },
      // Sory results by createdAt
      {
        $sort: { createdAt: -1 },
      },
    ]);

    // Add projects list to data to be accessible from views
    data.projects = projects;
    res.render("dashboard/projects", data);
  } catch (e) {
    req.flash("error", `Unable to retereive projects, please try again later`);

    return res.redirect("/dashboard");
  }
};

const GET_ADD_PROJECT = async (req, res) => {
  // set page data
  let data = {
    title: "Add a new project",
    layout: "./layouts/dashboard-layout",
    errors: {},
  };

  // Get all categories from DB;
  const categories = await Category.find();
  // set categories to data object to be accessible from views
  data.categories = categories;
  res.render("dashboard/projects/add", data);
};

const { getCategories, handleFileUpload } = require('../models/helpers');

const POST_ADD_PROJECT = async (req, res) => {
  const data = {
    title: 'Add a new project',
    layout: './layouts/dashboard-layout',
    errors: {},
  };

  data.categories = await getCategories();
  const { title, category, description, requirements } = req.body;

  try {
    const attachment = handleFileUpload(req.files?.attachment);

    await Project.create({
      title,
      category,
      description,
      requirements,
      user: req.session.user.id,
      attachment,
    });

    req.flash('success', `Project ${title} has been added successfully`);
    res.redirect('/dashboard/projects');
  } catch (error) {
    req.flash('error', 'There was an error, please try again later');
    res.render('dashboard/projects/add', data);
  }
};

const GET_EDIT_PROJECT = async (req, res) => {
  // set page data
  let data = {
    title: "Edit project",
    layout: "./layouts/dashboard-layout",
    errors: {},
  };

  const { id } = req.params;

  try {
    // Get project by ID and current user session ID;
    const project = await Project.findOne({
      _id: id,
      user: req.session.user.id,
    }).populate({ path: "category", select: "name", model: Category });

    // If no product found return to projects list
    if (!project) {
      return res.redirect("/dashboard/projects");
    }
    // GET categories list to be displayed on categories select list on update project form
    const categories = await Category.find();

    // pass project document and categories list to view
    data.project = project;
    data.categories = categories;

    return res.render("dashboard/projects/edit", data);
  } catch (error) {
    return res.redirect("/dashboard/projects");
  }
};

const POST_EDIT_PROJECT = async (req, res) => {
  const { id } = req.params;
  const { title, category, description, requirements } = req.body;

  try {
    // Get project by ID and current user session ID;
    const project = await Project.findOne({
      _id: id,
      user: req.session.user.id,
    }).populate({ path: "category", select: "name", model: Category });

    // If no product found return to projects list
    if (!project) {
      res.redirect("/dashboard/projects");
      return;
    }

    // check if files exists on request then get attachment file
    if (req.files) {
      // Delete old attachment if exists
      if (project.attachment) {
        fs.unlinkSync("./public/uploads/" + project.attachment);
      }

      let attachment = req.files.attachment;
      //Use the mv() method to place the file in the upload directory (i.e. "uploads")
      attachment.mv("./public/uploads/" + attachment.name);
    }

    // Update project
    await Project.findOneAndUpdate(
      { _id: id, user: req.session.user.id },
      {
        title,
        category,
        description,
        requirements,
        attachment: req?.files?.attachment
          ? req.files.attachment.name
          : project.attachment,
      }
    );

    req.flash("success", `Project ${title} has been updated sucessfully`);

    res.redirect("/dashboard/projects");
    return;
  } catch (error) {
    req.flash(
      "error",
      `Unable to edit project ${title}, please try again later`
    );
    res.redirect("/dashboard/projects");
    return;
  }
};

// Dashboard delete project
const POST_DELETE_PROJECT = async (req, res) => {
  const { id } = req.params;

  try {
    // Get project by ID and current user session ID;
    const project = await Project.findOne({
      _id: id,
      user: req.session.user.id,
    });

    // If no product found return to projects list
    if (!project) {
      return res.redirect("/dashboard/projects");
    }

    // Delete project attachment
    if (project.attachment) {
      fs.unlinkSync("./public/uploads/" + project.attachment);
    }

    // Delete project
    await Project.deleteOne({ _id: id });

    // Delete project requests
    await Request.deleteMany({ project: id });

    // Set success message
    req.flash(
      "success",
      `Project ${project.title} has been deleted successfully `
    );
  } catch (error) {
    // If error set error mesasge
    req.flash("error", `Unable to delete project, please try again later`);
  } finally {
    // Finally redirect to projects page
    return res.redirect("/dashboard/projects");
  }
};

// Dashboard get project by iD
const GET_DASHBOARD_ROUTE_PROJECT_BY_ID = async (req, res) => {
  const { id } = req.params;
  const data = {
    layout: "./layouts/dashboard-layout",
  };

  try {
    /**
     * Get project by ID and current user session id
     */
    const project = await Project.findOne({
      _id: id,
      user: req.session.user.id,
    })
      .populate({ path: "category", select: "name", model: Category })
      .populate({ path: "user", select: "name", model: User });

    if (!project) {
      return res.redirect("/dashboard/projects");
    }

    /**
     * Get requests for project
     */
    const requests = await Request.find({
      project: project.id,
    }).populate({ path: "sponsor", select: ["name", "email", "profilePicture"], model: User });

    const totalAccepted = await Request.find({
      project: project.id,
      status: "accepted",
    });

    // Pass project to view
    data.project = project;
    data.requests = requests;
    data.title = project.title;

    // Set this flag to enable/disable accept request if there is accepted request for this project
    data.canAcceptRequests = !totalAccepted.length;

    return res.render("dashboard/projects/details", data);
  } catch (error) {
    return res.redirect("/dashboard/projects");
  }
};

// Public routes controllers
const GET_PUBLIC_ROUTE_PROJECT_BY_ID = async (req, res) => {
  const { id } = req.params;
  const data = {
    layout: "./layouts/base-layout",
  };

  try {
    // Get project by ID
    const project = await Project.findById(id)
      .populate({ path: "category", select: "name", model: Category })
      .populate({ path: "user", select: ["name", "profilePicture"], model: User });

    if (!project) {
      return res.redirect("/");
    }

    if (req.session.user && req.session.user.type === "sponsor") {
      /**`
       * Get Total accepted requests
       */
      const totalAccepted = await Request.find({
        project: id,
        status: "accepted",
      });

      /**`
       * Get Request
       * If user authenticated and user is sponsor
       * check if sponsor submit a request for the current project
       * If request exists add request status to project document project.request.status
       */

      const requestDocument = await Request.findOne({
        project: id,
        sponsor: req.session.user.id,
      });

      if (requestDocument) {
        project.request = {
          status: requestDocument.status,
        };
      }

      // Set this flag to enable/disable accept request if there is accepted request for this project
      data.canRequestProject = !totalAccepted.length;
    }

    // Set page title to project title
    data.title = project.title;

    // Pass project to view
    data.project = project;

    return res.render("project", data);
  } catch (error) {
    return res.redirect("/");
  }
};

module.exports = {
  GET_PROJECTS_LIST,
  GET_ADD_PROJECT,
  POST_ADD_PROJECT,
  GET_EDIT_PROJECT,
  POST_EDIT_PROJECT,
  GET_PUBLIC_ROUTE_PROJECT_BY_ID,
  POST_DELETE_PROJECT,
  GET_DASHBOARD_ROUTE_PROJECT_BY_ID,
};
