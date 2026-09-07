const mongoose = require("mongoose");

const queueSchema = new mongoose.Schema(
    {
        stationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Station",
            required: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            default: null
        },

        position: {
            type: Number,
            required: true
        },

        estimatedWaitTime: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: ["Waiting", "Notified", "Completed", "Cancelled"],
            default: "Waiting"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Queue", queueSchema);