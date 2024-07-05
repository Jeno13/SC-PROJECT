const Request = require("../models/Request");
const Project = require("../models/Project");
const Notification = require("../models/Notification");
const User = require("../models/User");

const POST_REQUEST_PROJECT = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if request exists on same project
    const requestDocument = await Request.countDocuments({
      project: id,
      sponsor: req.session.user.id,
    });

    // If request found redirect back to project details with error message
    if (requestDocument) {
      req.flash("error", "You already request this project before");
      return res.redirect(`/project/${id}`);
    }

    // Add request to database;
    await Request.create({
      project: id,
      sponsor: req.session.user.id,
    });

    req.flash(
      "success",
      `Your request has been submitted and it's waiting student review`
    );

    return res.redirect(`/project/${id}`);
  } catch (error) {
    req.flash("error", "There was an error please try again later");

    return res.redirect(`/project/${id}`);
  }
};

const GET_DASHBOARD_REQUESTS = async (req, res) => {
  const data = {
    title: "requests",
    layout: "./layouts/dashboard-layout",
  };

  // Get status filter from url
  const { status } = req.query;

  // check if url has status filter and status accepted or pending
  if (status && ["pending", "accepted"].includes(status)) {
    const requestsList = await Request.find({
      sponsor: req.session.user.id,
      status,
    })
      .sort({ createdAt: -1 })
      .populate({ path: "project", select: "title", model: Project });

    // Update page title - pending/accepted requests
    data.title = `${status} requests`;

    data.requests = requestsList;

    return res.render("dashboard/requests", data);
  } else {
    const requestsList = await Request.find({ sponsor: req.session.user.id })
      .sort({ createdAt: -1 })
      .populate({ path: "project", select: "title", model: Project });

    data.requests = requestsList;

    return res.render("dashboard/requests", data);
  }
};

// Dashboard accept request
const POST_DASHBOARD_ROUTE_ACCEPT_PROJECT_REQUEST = async (req, res) => {
  const { id, request } = req.params;

  try {
    /**
     * Get project by ID and current user session id
     * for security we are getting project first by ID and check if this project related to current user
     * Then we will check current request if it's related to the project or not
     */
    const project = await Project.findOne({
      _id: id,
      user: req.session.user.id,
    });

    if (!project) {
      return res.redirect("/dashboard/projects");
    }

    /**
     * Get request by ID and project iD
     * check if request related to current project and status is pending or not
     * to allow only students accept thier project's requets
     *
     * We are populating user to get sponsor email to send him email
     */
    const requestDocument = await Request.findOne({
      _id: request,
      project: project.id,
      status: "pending",
    }).populate({ path: "sponsor", select: "email", model: User });

    if (!requestDocument) {
      return res.redirect("/dashboard/projects");
    }
    // Accepting request
    await Request.findOneAndUpdate({ _id: request }, { status: "accepted" });

    // Add notification to sponsor
    await Notification.create({
      user: requestDocument.sponsor,
      message: `Your request on project ${project.title} has been accepted`,
      redirectsToId: project.id,
    });

    // Flash success message to redirects back
    req.flash("success", "Request has been accepted");
    return res.redirect("back");
  } catch (error) {
    return res.redirect("back");
  }
};

module.exports = {
  POST_REQUEST_PROJECT,
  GET_DASHBOARD_REQUESTS,
  POST_DASHBOARD_ROUTE_ACCEPT_PROJECT_REQUEST,
};
