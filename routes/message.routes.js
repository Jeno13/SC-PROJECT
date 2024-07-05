const express = require("express");
const router = express.Router();


const MessageController = require("../controllers/message.controller");
const RedirectsIfNotAuthenticated = require('../middlewares/redirectsIfNotAuthenticated');

/**
 * GET: Project messages between student and sponsor
 */

router.get("/dashboard/projects/:id/request/:request/messages", RedirectsIfNotAuthenticated, MessageController.GET_PROJECT_MESSAGES);

/**
 * POST: Send message to sponsor/student regarding specific project request
 */
router.post("/dashboard/projects/:id/request/:request/messages", RedirectsIfNotAuthenticated, MessageController.POST_PROJECT_REQUEST_MESSAGE);

module.exports = router;