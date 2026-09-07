const Booking = require("../models/Booking");
const Station = require("../models/Station");
const Queue = require("../models/Queue");
const Notification = require("../models/Notification");

// Create Booking
const createBooking = async (req, res) => {
    try {
        const {
            stationId,
            slotTime,
            duration,
            vehicleNumber
        } = req.body;

        if (!stationId || !slotTime || !duration || !vehicleNumber) {
            return res.status(400).json({
                message: "All booking fields are required"
            });
        }

        const newSlotTime = new Date(slotTime);
        const newDuration = Number(duration);

        if (isNaN(newSlotTime.getTime())) {
            return res.status(400).json({
                message: "Invalid slot time"
            });
        }

        if (isNaN(newDuration) || newDuration <= 0) {
            return res.status(400).json({
                message: "Duration must be a valid positive number"
            });
        }

        const newEndTime = new Date(
            newSlotTime.getTime() + newDuration * 60000
        );

        const station = await Station.findById(stationId);

        if (!station) {
            return res.status(404).json({
                message: "Charging station not found"
            });
        }

        if (station.availableSlots <= 0) {
            return res.status(400).json({
                message: "No slots available at this station"
            });
        }

        const existingBookings = await Booking.find({
            stationId: stationId,
            status: "Booked"
        });

        for (const booking of existingBookings) {
            const existingStartTime = new Date(booking.slotTime);

            const existingEndTime = new Date(
                existingStartTime.getTime() +
                Number(booking.duration) * 60000
            );

            if (
                newSlotTime < existingEndTime &&
                newEndTime > existingStartTime
            ) {
                return res.status(400).json({
                    message: "This charging time overlaps with an existing booking"
                });
            }
        }

        const booking = await Booking.create({
            userId: req.user.userId,
            stationId: stationId,
            slotTime: newSlotTime,
            duration: newDuration,
            vehicleNumber: vehicleNumber,
            status: "Booked"
        });

        station.availableSlots =
            station.availableSlots - 1;

        await station.save();

        await Notification.create({
            userId: req.user.userId,
            title: "Booking Confirmed",
            message: `Your EV charging slot at ${station.name} has been booked successfully.`,
            type: "Booking"
        });

        res.status(201).json({
            message: "Charging slot booked successfully",
            booking
        });

    } catch (error) {
        res.status(500).json({
            message: "Booking failed",
            error: error.message
        });
    }
};


// Get My Bookings
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            userId: req.user.userId
        })
            .populate(
                "stationId",
                "name address chargingType pricePerUnit"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Bookings fetched successfully",
            bookings
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch bookings",
            error: error.message
        });
    }
};


// Complete Booking
const completeBooking = async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        if (booking.status === "Cancelled") {
            return res.status(400).json({
                message: "Cancelled booking cannot be completed"
            });
        }

        if (booking.status === "Completed") {
            return res.status(400).json({
                message: "Booking is already completed"
            });
        }

        booking.status = "Completed";

        await booking.save();

        const station = await Station.findById(
            booking.stationId
        );

        if (station) {
            station.availableSlots =
                station.availableSlots + 1;

            if (
                station.availableSlots >
                station.totalSlots
            ) {
                station.availableSlots =
                    station.totalSlots;
            }

            await station.save();
        }

        await Notification.create({
            userId: req.user.userId,
            title: "Charging Completed",
            message: "Your EV charging session has been completed successfully.",
            type: "Booking"
        });

        res.status(200).json({
            message: "Booking completed successfully",
            booking
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to complete booking",
            error: error.message
        });
    }
};


// Cancel Booking
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        if (booking.status === "Cancelled") {
            return res.status(400).json({
                message: "Booking is already cancelled"
            });
        }

        if (booking.status === "Completed") {
            return res.status(400).json({
                message: "Completed booking cannot be cancelled"
            });
        }

        booking.status = "Cancelled";

        await booking.save();

        const station = await Station.findById(
            booking.stationId
        );

        let notificationMessage =
            "Booking cancelled successfully";

        if (station) {

            station.availableSlots =
                station.availableSlots + 1;

            if (
                station.availableSlots >
                station.totalSlots
            ) {
                station.availableSlots =
                    station.totalSlots;
            }

            await station.save();

            const nextUser = await Queue.findOne({
                stationId: station._id,
                status: "Waiting"
            }).sort({ position: 1 });

            if (nextUser) {

                nextUser.status = "Notified";

                await nextUser.save();

                await Notification.create({
                    userId: nextUser.userId,
                    title: "Charging Slot Available",
                    message: `A charging slot is now available at ${station.name}. You have been notified from the queue.`,
                    type: "Queue"
                });

                notificationMessage =
                    "Booking cancelled and next queue user has been notified";
            }
        }

        await Notification.create({
            userId: req.user.userId,
            title: "Booking Cancelled",
            message: `Your EV charging booking at ${station ? station.name : "the charging station"} has been cancelled.`,
            type: "Booking"
        });

        res.status(200).json({
            message: notificationMessage,
            booking
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to cancel booking",
            error: error.message
        });
    }
};


module.exports = {
    createBooking,
    getMyBookings,
    completeBooking,
    cancelBooking
};