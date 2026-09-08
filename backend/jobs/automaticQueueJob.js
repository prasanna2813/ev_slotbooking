const Station = require("../models/Station");
const Queue = require("../models/Queue");
const Notification = require("../models/Notification");

const processQueue = async () => {
    try {

        const stations = await Station.find({
            availableSlots: { $gt: 0 }
        });

        for (const station of stations) {

            const waitingUser = await Queue.findOne({
                stationId: station._id,
                status: "Waiting"
            }).sort({
                position: 1
            });

            if (!waitingUser) {
                continue;
            }

            // Notify next waiting user
            waitingUser.status = "Notified";

            await waitingUser.save();


            // Create notification
            await Notification.create({
                userId: waitingUser.userId,
                title: "Charging Slot Available ⚡",
                message:
                    `A charging slot is now available at ${station.name}. You can book your charging slot now.`,
                type: "Queue"
            });

            console.log(
                `Queue notification sent to user ${waitingUser.userId} for station ${station.name}`
            );
        }

    } catch (error) {

        console.error(
            "Automatic queue job failed:",
            error.message
        );

    }
};


// Run every 1 minute
setInterval(
    processQueue,
    60 * 1000
);

console.log(
    "Automatic queue job started"
);

module.exports = processQueue;