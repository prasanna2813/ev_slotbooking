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

// Create Charging Station
router.post("/", authMiddleware, createStation);

// Get All Charging Stations
router.get("/", authMiddleware, getStations);

// Get Nearby Charging Stations
router.get("/nearby", authMiddleware, getNearbyStations);

// Smart Station Recommendation
router.get("/recommend", authMiddleware, recommendStation);

// Get Single Charging Station
router.get("/:id", authMiddleware, getStationById);

// Update Charging Station
router.put("/:id", authMiddleware, updateStation);

module.exports = router;