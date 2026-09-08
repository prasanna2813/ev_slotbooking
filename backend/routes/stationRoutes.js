const express = require("express");
const router = express.Router();

const {
    createStation,
    getStations,
    getStationById,
    updateStation,
    getNearbyStations,
    recommendStation
} = require("../controllers/stationController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");


// ========================================
// USER ROUTES
// ========================================

// Get all charging stations
router.get(
    "/",
    authMiddleware,
    getStations
);

// Get nearby charging stations
router.get(
    "/nearby",
    authMiddleware,
    getNearbyStations
);

// Get recommended charging station
router.get(
    "/recommend",
    authMiddleware,
    recommendStation
);

// Get station by ID
router.get(
    "/:id",
    authMiddleware,
    getStationById
);


// ========================================
// ADMIN ROUTES
// ========================================

// Create new charging station
router.post(
    "/",
    adminMiddleware,
    createStation
);

// Update charging station
router.put(
    "/:id",
    adminMiddleware,
    updateStation
);


module.exports = router;