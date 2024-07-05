const express = require('express')
const router = express.Router();

const DashboardController = require("../controllers/dashboard.controller");
const RedirectsIfNotAuthenticated = require('../middlewares/redirectsIfNotAuthenticated');

/**
 * Dashboard routes
 * GET: Render dashboard page
 */
router.get("/dashboard", RedirectsIfNotAuthenticated, DashboardController.GET_DASHBOARD_HOME);

module.exports = router;