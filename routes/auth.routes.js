const express = require('express')
const router = express.Router();

const AuthController = require("../controllers/auth.controller");
const RedirectsIfAuthenticated = require('../middlewares/redirectsIfAuthenticated');

/**
 * Register routes
 * GET: Render register page
 * POST: Submit register data and create a new user
 */
router.get("/register", RedirectsIfAuthenticated, AuthController.GET_REGISTER);
router.post("/register", RedirectsIfAuthenticated,  AuthController.POST_REGISTER);

/**
 * Login routes
 * GET: Render login page
 * POST: Submit login form to authenticate user
 */
router.get("/login", RedirectsIfAuthenticated, AuthController.GET_LOGIN);
router.post("/login", RedirectsIfAuthenticated,  AuthController.POST_LOGIN);

// Logout route
router.get("/logout", AuthController.LOGOUT);

module.exports = router;