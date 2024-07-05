const express = require("express");
const router = express.Router();


const ProjectController = require("../controllers/project.controller");
const CanAccessDashboardProjects = require('../middlewares/canAccessDashboardProjects');

/**
 * Dashboard Routes
 * GET: Projects list route
 */
router.get("/dashboard/projects", CanAccessDashboardProjects, ProjectController.GET_PROJECTS_LIST);

/**
 * Dashboard Routes
 * GET: Add project route
 */
router.get("/dashboard/projects/add", CanAccessDashboardProjects, ProjectController.GET_ADD_PROJECT);

/**
 * Dashboard Routes
 * POST: Add project route
 */
router.post("/dashboard/projects/add", CanAccessDashboardProjects, ProjectController.POST_ADD_PROJECT);


/**
 * Dashboard Routes
 * GET: Edit project by ID
 */
router.get("/dashboard/projects/:id/edit", CanAccessDashboardProjects, ProjectController.GET_EDIT_PROJECT);


/**
 * Dashboard Routes
 * POST: Submit edit project by ID
 */
router.post("/dashboard/projects/:id/edit", CanAccessDashboardProjects, ProjectController.POST_EDIT_PROJECT);


/**
 * Dashboard Routes
 * DELETE: delete project
 */
router.post("/dashboard/projects/:id/delete", CanAccessDashboardProjects, ProjectController.POST_DELETE_PROJECT);

/**
 * Dashboard Routes
 * GET: project by ID
 */
router.get("/dashboard/projects/:id", CanAccessDashboardProjects, ProjectController.GET_DASHBOARD_ROUTE_PROJECT_BY_ID);

/**
 * Public Routes
 * GET: Project by ID
 */
router.get("/project/:id", ProjectController.GET_PUBLIC_ROUTE_PROJECT_BY_ID);

module.exports = router;