const express = require("express");
const router = express.Router();

const CategoryController = require("../controllers/category.controller");

/**
 * GET: projects by category ID
 */
router.get("/category/:id", CategoryController.GET_PROJECTS_BY_CAEGORY);

module.exports = router;