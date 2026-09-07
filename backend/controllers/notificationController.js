const Notification = require("../models/Notification");

// Create Notification
const createNotification = async (req, res) => {
    try {
        const {
            userId,
            title,
            message,
            type
        } = req.body;

        if (!userId || !title || !message) {
            return res.status(400).json({
                message: "User ID, title and message are required"
            });
        }

        const notification = await Notification.create({
            userId,
            title,
            message,
            type: type || "System"
        });

        res.status(201).json({
            message: "Notification created successfully",
            notification
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create notification",
            error: error.message
        });
    }
};


// Get My Notifications
const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            userId: req.user.userId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Notifications fetched successfully",
            notifications
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch notifications",
            error: error.message
        });
    }
};


// Mark Notification as Read
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        notification.isRead = true;

        await notification.save();

        res.status(200).json({
            message: "Notification marked as read",
            notification
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update notification",
            error: error.message
        });
    }
};


// Mark All Notifications as Read
const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            {
                userId: req.user.userId,
                isRead: false
            },
            {
                $set: {
                    isRead: true
                }
            }
        );

        res.status(200).json({
            message: "All notifications marked as read"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update notifications",
            error: error.message
        });
    }
};


module.exports = {
    createNotification,
    getMyNotifications,
    markAsRead,
    markAllAsRead
};