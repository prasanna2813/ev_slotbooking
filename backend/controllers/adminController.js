const Admin = require("../models/Admin");
const User = require("../models/User");
const Station = require("../models/Station");
const Booking = require("../models/Booking");
const Queue = require("../models/Queue");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ===============================
// ADMIN REGISTER
// ===============================
const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message:
                    "Password must contain uppercase, lowercase, number, special character and minimum 8 characters"
            });
        }

        const existingAdmin = await Admin.findOne({ email });

        if (existingAdmin) {
            return res.status(400).json({
                message: "Admin already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await Admin.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "Admin registered successfully",
            adminId: admin._id,
            name: admin.name,
            email: admin.email
        });

    } catch (error) {
        res.status(500).json({
            message: "Admin registration failed",
            error: error.message
        });
    }
};


// ===============================
// ADMIN LOGIN
// ===============================
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({
                message: "Invalid admin credentials"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid admin credentials"
            });
        }

        const token = jwt.sign(
            {
                adminId: admin._id,
                role: "admin"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            message: "Admin login successful",
            token,
            adminId: admin._id,
            name: admin.name,
            role: "admin"
        });

    } catch (error) {
        res.status(500).json({
            message: "Admin login failed",
            error: error.message
        });
    }
};


// ===============================
// ADMIN DASHBOARD STATISTICS
// ===============================
const getDashboardStats = async (req, res) => {
    try {

        const totalUsers = await User.countDocuments();

        const totalStations = await Station.countDocuments();

        const totalBookings = await Booking.countDocuments();

        const activeBookings = await Booking.countDocuments({
            status: "Booked"
        });

        const waitingUsers = await Queue.countDocuments({
            status: "Waiting"
        });

        const stations = await Station.find();

        let totalSlots = 0;
        let availableSlots = 0;

        stations.forEach((station) => {
            totalSlots += station.totalSlots;
            availableSlots += station.availableSlots;
        });

        res.status(200).json({
            message: "Admin dashboard statistics fetched successfully",

            statistics: {
                totalUsers,
                totalStations,
                totalBookings,
                activeBookings,
                waitingUsers,
                totalSlots,
                availableSlots
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch dashboard statistics",
            error: error.message
        });
    }
};


// ===============================
// RECENT BOOKING INFORMATION
// ===============================
const getRecentBookings = async (req, res) => {
    try {

        const bookings = await Booking.find()
            .populate(
                "userId",
                "name email vehicleNumber vehicleModel batteryPercentage"
            )
            .populate(
                "stationId",
                "name address chargingType pricePerUnit"
            )
            .sort({ createdAt: -1 })
            .limit(20);

        const bookingInformation = bookings.map((booking) => {

            return {
                bookingId: booking._id,

                user: {
                    name: booking.userId?.name || "Unknown",
                    email: booking.userId?.email || "Unknown",
                    vehicleNumber:
                        booking.userId?.vehicleNumber || booking.vehicleNumber,
                    vehicleModel:
                        booking.userId?.vehicleModel || "Unknown",
                    batteryPercentage:
                        booking.userId?.batteryPercentage ?? null
                },

                station: {
                    name: booking.stationId?.name || "Unknown",
                    address: booking.stationId?.address || "Unknown",
                    chargingType:
                        booking.stationId?.chargingType || "Unknown",
                    pricePerUnit:
                        booking.stationId?.pricePerUnit ?? null
                },

                slotTime: booking.slotTime,
                duration: booking.duration,
                status: booking.status,
                createdAt: booking.createdAt
            };
        });

        res.status(200).json({
            message: "Booking information fetched successfully",
            bookings: bookingInformation
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch booking information",
            error: error.message
        });
    }
};


// ===============================
// EXPORTS
// ===============================
module.exports = {
    registerAdmin,
    loginAdmin,
    getDashboardStats,
    getRecentBookings
};