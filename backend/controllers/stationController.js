const Station = require("../models/Station");
const Queue = require("../models/Queue");
const User = require("../models/User");

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
                message:
                    "Latitude, longitude and radius must be valid numbers"
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
                    distance: Number(
                        distance.toFixed(2)
                    )
                };

            })
            .filter(
                (station) =>
                    station.distance <= searchRadius
            )
            .sort(
                (a, b) =>
                    a.distance - b.distance
            );

        res.status(200).json({
            message:
                "Nearby charging stations fetched successfully",
            searchRadius:
                `${searchRadius} km`,
            count:
                nearbyStations.length,
            stations:
                nearbyStations
        });

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to find nearby charging stations",
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
                message:
                    "Latitude and longitude are required"
            });
        }


        const userLatitude =
            parseFloat(latitude);

        const userLongitude =
            parseFloat(longitude);


        if (
            isNaN(userLatitude) ||
            isNaN(userLongitude)
        ) {
            return res.status(400).json({
                message:
                    "Latitude and longitude must be valid numbers"
            });
        }


        // ========================================
        // GET LOGGED-IN USER
        // ========================================

        const user =
            await User.findById(
                req.user.userId
            );


        if (!user) {
            return res.status(404).json({
                message:
                    "User not found"
            });
        }


        // ========================================
        // USER BATTERY
        // ========================================

        const batteryPercentage =
            Number(
                user.batteryPercentage
            );


        // ========================================
        // GET ALL STATIONS
        // ========================================

        let stations =
            await Station.find();


        // ========================================
        // FILTER BY CHARGING TYPE
        // ========================================

        if (chargingType) {

            stations =
                stations.filter(
                    (station) =>
                        station.chargingType
                            .toLowerCase() ===
                        chargingType
                            .toLowerCase()
                );

        }


        if (stations.length === 0) {

            return res.status(404).json({
                message:
                    "No charging stations found"
            });

        }


        const recommendations = [];


        // ========================================
        // CALCULATE SCORE
        // ========================================

        for (const station of stations) {


            // Distance
            const distance =
                calculateDistance(
                    userLatitude,
                    userLongitude,
                    station.latitude,
                    station.longitude
                );


            // Waiting users
            const waitingUsers =
                await Queue.countDocuments({
                    stationId:
                        station._id,
                    status:
                        "Waiting"
                });


            // Estimated waiting time
            const waitingTime =
                waitingUsers * 30;


            // ========================================
            // BASE SCORE
            // ========================================

            let score = 100;


            // ========================================
            // DISTANCE PENALTY
            // ========================================

            score -=
                distance * 5;


            // ========================================
            // AVAILABILITY BONUS
            // ========================================

            score +=
                station.availableSlots * 10;


            // ========================================
            // WAITING TIME PENALTY
            // ========================================

            score -=
                waitingTime * 0.5;


            // ========================================
            // PRICE PENALTY
            // ========================================

            score -=
                station.pricePerUnit * 1;


            // ========================================
            // BATTERY-AWARE BONUS
            // ========================================

            let batteryBonus = 0;


            /*
                Low battery = higher urgency.

                Battery <= 20%
                → Strong preference for stations
                  with available slots.

                Battery 21% - 50%
                → Moderate preference.

                Battery > 50%
                → Normal preference.
            */


            if (batteryPercentage <= 20) {

                if (
                    station.availableSlots > 0
                ) {

                    batteryBonus = 30;

                } else {

                    batteryBonus = -30;

                }

            } else if (
                batteryPercentage <= 50
            ) {

                if (
                    station.availableSlots > 0
                ) {

                    batteryBonus = 15;

                }

            } else {

                if (
                    station.availableSlots > 0
                ) {

                    batteryBonus = 5;

                }

            }


            score += batteryBonus;


            // ========================================
            // PUSH RECOMMENDATION
            // ========================================

            recommendations.push({

                station:
                    station,

                distance:
                    Number(
                        distance.toFixed(2)
                    ),

                availableSlots:
                    station.availableSlots,

                waitingUsers:
                    waitingUsers,

                estimatedWaitTime:
                    waitingTime,

                batteryPercentage:
                    batteryPercentage,

                batteryBonus:
                    batteryBonus,

                score:
                    Number(
                        score.toFixed(2)
                    )

            });

        }


        // ========================================
        // SORT BY SCORE
        // ========================================

        recommendations.sort(
            (a, b) =>
                b.score - a.score
        );


        const bestStation =
            recommendations[0];


        // ========================================
        // RESPONSE
        // ========================================

        res.status(200).json({

            message:
                "Smart battery-aware charging station recommendation generated",

            batteryPercentage:
                batteryPercentage,

            recommendedStation:
                bestStation,

            alternatives:
                recommendations.slice(1)

        });


    } catch (error) {

        res.status(500).json({

            message:
                "Failed to generate recommendation",

            error:
                error.message

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

    const earthRadius =
        6371;


    const latDifference =
        toRadians(
            lat2 - lat1
        );


    const lonDifference =
        toRadians(
            lon2 - lon1
        );


    const a =
        Math.sin(
            latDifference / 2
        ) *
        Math.sin(
            latDifference / 2
        ) +

        Math.cos(
            toRadians(lat1)
        ) *
        Math.cos(
            toRadians(lat2)
        ) *

        Math.sin(
            lonDifference / 2
        ) *
        Math.sin(
            lonDifference / 2
        );


    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );


    return earthRadius * c;
};


// Convert Degrees to Radians
const toRadians = (
    degrees
) => {

    return (
        degrees *
        (Math.PI / 180)
    );

};



const adminGetStations = async (req, res) => {
    try {

        const stations = await Station.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Stations fetched successfully",
            stations
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch stations",
            error: error.message
        });

    }
};


const deleteStation = async (req, res) => {
    try {

        const { id } = req.params;

        const station = await Station.findById(id);

        if (!station) {

            return res.status(404).json({
                message: "Station not found"
            });

        }

        await Station.findByIdAndDelete(id);

        res.status(200).json({
            message: "Station deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to delete station",
            error: error.message
        });

    }
};
module.exports = {
    createStation,
    getStations,
    getStationById,
    updateStation,
    getNearbyStations,
    recommendStation,
    adminGetStations,
    deleteStation
};