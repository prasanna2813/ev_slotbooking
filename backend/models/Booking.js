const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        stationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Station",
            required: true
        },

        slotTime: {
            type: Date,
            required: true
        },

        duration: {
            type: Number,
            required: true
        },

        vehicleNumber: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["Booked", "Completed", "Cancelled"],
            default: "Booked"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Booking", bookingSchema);