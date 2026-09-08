const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const stationRoutes = require("./routes/stationRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const queueRoutes = require("./routes/queueRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// ========================================
// JOBS
// ========================================

// Booking reminder job
require("./jobs/reminderJob");

// Automatic queue notification job
require("./jobs/automaticQueueJob");


// ========================================
// EXPRESS APP
// ========================================

const app = express();


// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());

app.use(express.json());


// ========================================
// ROUTES
// ========================================

// User authentication
app.use(
    "/api/auth",
    authRoutes
);

// Admin authentication & management
app.use(
    "/api/admin",
    adminRoutes
);

// Charging stations
app.use(
    "/api/stations",
    stationRoutes
);

// Bookings
app.use(
    "/api/bookings",
    bookingRoutes
);

// Queue
app.use(
    "/api/queue",
    queueRoutes
);

// Notifications
app.use(
    "/api/notifications",
    notificationRoutes
);


// ========================================
// MONGODB CONNECTION
// ========================================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {

        console.log(
            "MongoDB connected successfully"
        );

    })
    .catch((error) => {

        console.log(
            "MongoDB connection failed"
        );

        console.log(
            error
        );

    });


// ========================================
// TEST ROUTE
// ========================================

app.get("/", (req, res) => {

    res.send(
        "EV Slot Booking Backend is Running!"
    );

});


// ========================================
// SERVER
// ========================================

const PORT =
    process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});