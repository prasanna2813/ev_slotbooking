const express = require("express");

const router = express.Router();

const {
    getMyNotifications,
    markAsRead,
    markAllAsRead
} = require("../controllers/notificationController");

const authMiddleware = require("../middleware/authMiddleware");


// ========================================
// GET MY NOTIFICATIONS
// ========================================

router.get(
    "/",
    authMiddleware,
    getMyNotifications
);


// ========================================
// MARK ONE NOTIFICATION AS READ
// ========================================

router.put(
    "/read/:id",
    authMiddleware,
    markAsRead
);


// ========================================
// MARK ALL NOTIFICATIONS AS READ
// ========================================

router.put(
    "/read-all",
    authMiddleware,
    markAllAsRead
);


module.exports = router;