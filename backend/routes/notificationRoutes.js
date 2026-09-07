const express = require("express");

const router = express.Router();

const {
    createNotification,
    getMyNotifications,
    markAsRead,
    markAllAsRead
} = require("../controllers/notificationController");

const authMiddleware = require("../middleware/authMiddleware");

// Create notification
router.post("/", authMiddleware, createNotification);

// Get my notifications
router.get("/", authMiddleware, getMyNotifications);

// Mark one notification as read
router.put("/read/:id", authMiddleware, markAsRead);

// Mark all notifications as read
router.put("/read-all", authMiddleware, markAllAsRead);

module.exports = router;