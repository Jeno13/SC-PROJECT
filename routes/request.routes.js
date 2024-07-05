const express = require("express");
const router = express.Router();

const RequestController = require("../controllers/request.controller");
const CanAccessDashboardRequests = require("../middlewares/canAccessDashboardRequests");
const CanAccessDashboardProjects = require("../middlewares/canAccessDashboardProjects");

/**
 * POST: Submit request on project by ID
 */
router.post("/project/:id/request", RequestController.POST_REQUEST_PROJECT);


/**
 * Dashboard Routes
 * post: accept request by project ID and request ID
 */
router.post("/dashboard/projects/:id/request/:request/accept", CanAccessDashboardProjects, RequestController.POST_DASHBOARD_ROUTE_ACCEPT_PROJECT_REQUEST);


/**
 * Dashboard - Sponsor
 * GET: all requests
 */
router.get("/dashboard/requests", CanAccessDashboardRequests, RequestController.GET_DASHBOARD_REQUESTS);
module.exports = router;