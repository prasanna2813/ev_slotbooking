const express = require("express");
const router = express.Router();

const {
    registerAdmin,
    loginAdmin,
    getDashboardStats,
    getRecentBookings
} = require("../controllers/adminController");

const {
    adminGetStations,
    createStation,
    updateStation,
    deleteStation
} = require("../controllers/stationController");

const adminMiddleware = require("../middleware/adminMiddleware");


// ===============================
// ADMIN AUTH
// ===============================

router.post(
    "/register",
    registerAdmin
);

router.post(
    "/login",
    loginAdmin
);


// ===============================
// ADMIN DASHBOARD
// ===============================

router.get(
    "/dashboard",
    adminMiddleware,
    getDashboardStats
);


// ===============================
// ADMIN BOOKING INFORMATION
// ===============================

router.get(
    "/bookings",
    adminMiddleware,
    getRecentBookings
);


// ===============================
// ADMIN STATION MANAGEMENT
// ===============================

// Get all stations
router.get(
    "/stations",
    adminMiddleware,
    adminGetStations
);


// Add station
router.post(
    "/stations",
    adminMiddleware,
    createStation
);


// Update station
router.put(
    "/stations/:id",
    adminMiddleware,
    updateStation
);


// Delete station
router.delete(
    "/stations/:id",
    adminMiddleware,
    deleteStation
);


module.exports = router;