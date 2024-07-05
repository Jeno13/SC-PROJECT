const express = require("express");
const router = express.Router();

const AppCountroller = require("../controllers/app.controller");

router.get("/", AppCountroller.GET_HOME_VIEW);

/**
 * GET: Search
 */
router.get("/search", AppCountroller.GET_SEARCH_VIEW);

module.exports = router;
