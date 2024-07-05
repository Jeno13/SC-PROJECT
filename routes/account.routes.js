const express = require("express");
const router = express.Router();


const AccountController = require("../controllers/account.controller");
const RedirectsIfNotAuthenticated = require('../middlewares/redirectsIfNotAuthenticated');

/**
 * Account edit route
 * GET: render edit account page
 */
router.get("/dashboard/account/update", RedirectsIfNotAuthenticated, AccountController.GET_UPDATE_ACCOUNT);
router.post("/dashboard/account/update", RedirectsIfNotAuthenticated, AccountController.POST_UPDATE_ACCOUNT);


router.get("/dashboard/account/password", RedirectsIfNotAuthenticated, AccountController.GET_UPDATE_ACCOUNT_PASSWORD);
router.post("/dashboard/account/password", RedirectsIfNotAuthenticated, AccountController.POST_UPDATE_ACCOUNT_PASSWORD);

module.exports = router;