const cron = require("node-cron");
const Booking = require("../models/Booking");
const Notification = require("../models/Notification");

// Run every minute
cron.schedule("* * * * *", async () => {
    try {
        const now = new Date();

        // Check bookings starting within the next 30 minutes
        const reminderStart = new Date(
            now.getTime() + 29 * 60 * 1000
        );

        const reminderEnd = new Date(
            now.getTime() + 30 * 60 * 1000
        );

        const bookings = await Booking.find({
            status: "Booked",
            slotTime: {
                $gte: reminderStart,
                $lt: reminderEnd
            }
        }).populate("stationId", "name");

        for (const booking of bookings) {

            // Check if reminder already exists
            const existingNotification =
                await Notification.findOne({
                    userId: booking.userId,
                    type: "Reminder",
                    message: {
                        $regex: booking._id.toString()
                    }
                });

            if (existingNotification) {
                continue;
            }

            await Notification.create({
                userId: booking.userId,
                title: "Charging Slot Reminder",
                message: `Your EV charging slot at ${booking.stationId.name} starts in 30 minutes. Booking ID: ${booking._id}`,
                type: "Reminder"
            });

            console.log(
                `Reminder notification created for booking ${booking._id}`
            );
        }

    } catch (error) {
        console.log(
            "Reminder job failed:",
            error.message
        );
    }
});

console.log("Booking reminder job started");