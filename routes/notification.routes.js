const express = require("express");
const router = express.Router();


const NotificationController = require("../controllers/notification.controller");
const CanAccessDashboardRequests = require('../middlewares/canAccessDashboardRequests');

/**
 * Dashboard Notification Route
 * GET: render notifications page
 */
router.get("/dashboard/notifications", CanAccessDashboardRequests, NotificationController.GET_NOTIFICATIONS);


/**
 * Mark as read
 * POST: mark notification as read
 */
router.post("/dashboard/notifications/:id/mark-read", CanAccessDashboardRequests, NotificationController.POST_MARK_NOTIFICATION_AS_READ);


/**
 * Delete notification
 * POST: Delete notification
 */
router.post("/dashboard/notifications/:id/delete", CanAccessDashboardRequests, NotificationController.DELETE_NOTIFICATION);


module.exports = router;