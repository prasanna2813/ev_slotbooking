const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        address: {
            type: String,
            required: true
        },

        latitude: {
            type: Number,
            required: true
        },

        longitude: {
            type: Number,
            required: true
        },

        totalSlots: {
            type: Number,
            required: true
        },

        availableSlots: {
            type: Number,
            required: true
        },

        chargingType: {
            type: String,
            required: true
        },

        pricePerUnit: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Station", stationSchema);