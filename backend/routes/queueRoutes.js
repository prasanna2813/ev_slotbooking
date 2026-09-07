const express = require("express");

const router = express.Router();

const {
    addToQueue,
    getMyQueueStatus,
    notifyNextUser,
    cancelQueue
} = require("../controllers/queueController");

const authMiddleware = require("../middleware/authMiddleware");

// Add user to queue
router.post("/", authMiddleware, addToQueue);

// Get my queue status
router.get("/my-queue", authMiddleware, getMyQueueStatus);

// Notify next user when slot becomes available
router.post("/notify-next", authMiddleware, notifyNextUser);

// Cancel queue entry
router.put("/cancel/:id", authMiddleware, cancelQueue);

module.exports = router;