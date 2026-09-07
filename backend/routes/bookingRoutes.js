const express = require("express");

const router = express.Router();

const {
    createBooking,
    getMyBookings,
    completeBooking,
    cancelBooking
} = require("../controllers/bookingController");

const authMiddleware = require("../middleware/authMiddleware");

// Create Booking
router.post("/", authMiddleware, createBooking);

// Get My Bookings
router.get("/my-bookings", authMiddleware, getMyBookings);

// Complete Booking
router.put("/complete/:id", authMiddleware, completeBooking);

// Cancel Booking
router.put("/cancel/:id", authMiddleware, cancelBooking);

module.exports = router;