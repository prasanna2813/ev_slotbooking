const Station = require("../models/Station");
const Queue = require("../models/Queue");

// Create Charging Station
const createStation = async (req, res) => {
    try {
        const {
            name,
            address,
            latitude,
            longitude,
            totalSlots,
            availableSlots,
            chargingType,
            pricePerUnit
        } = req.body;

        const station = await Station.create({
            name,
            address,
            latitude,
            longitude,
            totalSlots,
            availableSlots,
            chargingType,
            pricePerUnit
        });

        res.status(201).json({
            message: "Charging station created successfully",
            station
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create charging station",
            error: error.message
        });
    }
};


// Get All Charging Stations
const getStations = async (req, res) => {
    try {
        const stations = await Station.find();

        res.status(200).json({
            message: "Charging stations fetched successfully",
            stations
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch charging stations",
            error: error.message
        });
    }
};


// Get Single Charging Station
const getStationById = async (req, res) => {
    try {
        const station = await Station.findById(req.params.id);

        if (!station) {
            return res.status(404).json({
                message: "Charging station not found"
            });
        }

        res.status(200).json({
            message: "Charging station fetched successfully",
            station
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch charging station",
            error: error.message
        });
    }
};


// Update Charging Station
const updateStation = async (req, res) => {
    try {
        const station = await Station.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!station) {
            return res.status(404).json({
                message: "Charging station not found"
            });
        }

        res.status(200).json({
            message: "Charging station updated successfully",
            station
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update charging station",
            error: error.message
        });
    }
};


// Find Nearby Charging Stations
const getNearbyStations = async (req, res) => {
    try {
        const {
            latitude,
            longitude,
            radius = 10
        } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({
                message: "Latitude and longitude are required"
            });
        }

        const userLatitude = parseFloat(latitude);
        const userLongitude = parseFloat(longitude);
        const searchRadius = parseFloat(radius);

        if (
            isNaN(userLatitude) ||
            isNaN(userLongitude) ||
            isNaN(searchRadius)
        ) {
            return res.status(400).json({
                message: "Latitude, longitude and radius must be valid numbers"
            });
        }

        const stations = await Station.find();

        const nearbyStations = stations
            .map((station) => {
                const distance = calculateDistance(
                    userLatitude,
                    userLongitude,
                    station.latitude,
                    station.longitude
                );

                return {
                    ...station.toObject(),
                    distance: Number(distance.toFixed(2))
                };
            })
            .filter((station) => station.distance <= searchRadius)
            .sort((a, b) => a.distance - b.distance);

        res.status(200).json({
            message: "Nearby charging stations fetched successfully",
            searchRadius: `${searchRadius} km`,
            count: nearbyStations.length,
            stations: nearbyStations
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to find nearby charging stations",
            error: error.message
        });
    }
};


// Smart Station Recommendation
const recommendStation = async (req, res) => {
    try {
        const {
            latitude,
            longitude,
            chargingType
        } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({
                message: "Latitude and longitude are required"
            });
        }

        const userLatitude = parseFloat(latitude);
        const userLongitude = parseFloat(longitude);

        if (isNaN(userLatitude) || isNaN(userLongitude)) {
            return res.status(400).json({
                message: "Latitude and longitude must be valid numbers"
            });
        }

        // Get all stations
        let stations = await Station.find();

        // Filter by charging type if provided
        if (chargingType) {
            stations = stations.filter(
                (station) =>
                    station.chargingType.toLowerCase() ===
                    chargingType.toLowerCase()
            );
        }

        if (stations.length === 0) {
            return res.status(404).json({
                message: "No charging stations found"
            });
        }

        const recommendations = [];

        for (const station of stations) {

            // Calculate distance
            const distance = calculateDistance(
                userLatitude,
                userLongitude,
                station.latitude,
                station.longitude
            );

            // Get waiting users
            const waitingUsers = await Queue.countDocuments({
                stationId: station._id,
                status: "Waiting"
            });

            // Calculate estimated waiting time
            const waitingTime = waitingUsers * 30;

            // Calculate recommendation score
            let score = 100;

            // Distance penalty
            score -= distance * 5;

            // Availability bonus
            score += station.availableSlots * 10;

            // Waiting time penalty
            score -= waitingTime * 0.5;

            // Price penalty
            score -= station.pricePerUnit * 1;

            recommendations.push({
                station: station,
                distance: Number(distance.toFixed(2)),
                availableSlots: station.availableSlots,
                waitingUsers: waitingUsers,
                estimatedWaitTime: waitingTime,
                score: Number(score.toFixed(2))
            });
        }

        // Highest score = best station
        recommendations.sort(
            (a, b) => b.score - a.score
        );

        const bestStation = recommendations[0];

        res.status(200).json({
            message: "Smart charging station recommendation generated",
            recommendedStation: bestStation,
            alternatives: recommendations.slice(1)
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to generate recommendation",
            error: error.message
        });
    }
};


// Haversine Formula
const calculateDistance = (
    lat1,
    lon1,
    lat2,
    lon2
) => {
    const earthRadius = 6371;

    const latDifference = toRadians(lat2 - lat1);
    const lonDifference = toRadians(lon2 - lon1);

    const a =
        Math.sin(latDifference / 2) *
        Math.sin(latDifference / 2) +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(lonDifference / 2) *
        Math.sin(lonDifference / 2);

    const c =
        2 * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return earthRadius * c;
};


// Convert Degrees to Radians
const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
};


module.exports = {
    createStation,
    getStations,
    getStationById,
    updateStation,
    getNearbyStations,
    recommendStation
};