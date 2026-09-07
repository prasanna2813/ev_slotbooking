const Queue = require("../models/Queue");
const Station = require("../models/Station");
const Notification = require("../models/Notification");


// ========================================
// ADD USER TO QUEUE
// ========================================

const addToQueue = async (req, res) => {

    try {

        const { stationId } = req.body;


        if (!stationId) {

            return res.status(400).json({
                message: "Station ID is required"
            });

        }


        const station =
            await Station.findById(stationId);


        if (!station) {

            return res.status(404).json({
                message: "Charging station not found"
            });

        }


        // Queue only when station is full

        if (station.availableSlots > 0) {

            return res.status(400).json({
                message:
                    "Slots are available. Please book a charging slot instead."
            });

        }


        // Check duplicate queue

        const existingQueue =
            await Queue.findOne({

                stationId: stationId,

                userId: req.user.userId,

                status: "Waiting"

            });


        if (existingQueue) {

            return res.status(400).json({
                message:
                    "You are already in the queue"
            });

        }


        // Find last position

        const lastQueue =
            await Queue.findOne({

                stationId: stationId,

                status: "Waiting"

            }).sort({
                position: -1
            });


        const position =
            lastQueue
                ? lastQueue.position + 1
                : 1;


        // 30 minutes per waiting user

        const estimatedWaitTime =
            position * 30;


        const queueEntry =
            await Queue.create({

                stationId:
                    stationId,

                userId:
                    req.user.userId,

                position:
                    position,

                estimatedWaitTime:
                    estimatedWaitTime,

                status:
                    "Waiting"

            });


        // Queue notification

        await Notification.create({

            userId:
                req.user.userId,

            title:
                "Added to Charging Queue",

            message:
                `You have been added to the queue at ${station.name}. Your position is ${position}. Estimated waiting time is ${estimatedWaitTime} minutes.`,

            type:
                "Queue"

        });


        res.status(201).json({

            message:
                "Added to charging queue successfully",

            queue:
                queueEntry

        });


    } catch (error) {

        res.status(500).json({

            message:
                "Failed to add to queue",

            error:
                error.message

        });

    }

};


// ========================================
// GET MY QUEUE STATUS
// ========================================

const getMyQueueStatus = async (req, res) => {

    try {

        const queue =
            await Queue.find({

                userId:
                    req.user.userId,

                status: {
                    $in: [
                        "Waiting",
                        "Notified"
                    ]
                }

            })
                .populate(
                    "stationId",
                    "name address chargingType pricePerUnit"
                )
                .sort({
                    position: 1
                });


        res.status(200).json({

            message:
                "Queue status fetched successfully",

            queue:
                queue

        });


    } catch (error) {

        res.status(500).json({

            message:
                "Failed to fetch queue status",

            error:
                error.message

        });

    }

};


// ========================================
// NOTIFY NEXT USER
// ========================================

const notifyNextUser = async (req, res) => {

    try {

        const { stationId } = req.body;


        if (!stationId) {

            return res.status(400).json({
                message:
                    "Station ID is required"
            });

        }


        const station =
            await Station.findById(
                stationId
            );


        if (!station) {

            return res.status(404).json({
                message:
                    "Charging station not found"
            });

        }


        if (station.availableSlots <= 0) {

            return res.status(400).json({
                message:
                    "No charging slot is currently available"
            });

        }


        // Find first waiting user

        const nextUser =
            await Queue.findOne({

                stationId:
                    stationId,

                status:
                    "Waiting"

            }).sort({
                position: 1
            });


        if (!nextUser) {

            return res.status(404).json({
                message:
                    "No users are waiting in the queue"
            });

        }


        // Change queue status

        nextUser.status =
            "Notified";


        await nextUser.save();


        // Create notification

        await Notification.create({

            userId:
                nextUser.userId,

            title:
                "Charging Slot Available",

            message:
                `A charging slot is now available at ${station.name}. Please book your charging slot.`,

            type:
                "Queue"

        });


        res.status(200).json({

            message:
                "Next user has been notified successfully",

            queue:
                nextUser

        });


    } catch (error) {

        res.status(500).json({

            message:
                "Failed to notify next user",

            error:
                error.message

        });

    }

};


// ========================================
// CANCEL QUEUE
// ========================================

const cancelQueue = async (req, res) => {

    try {

        const queueEntry =
            await Queue.findOne({

                _id:
                    req.params.id,

                userId:
                    req.user.userId,

                status:
                    "Waiting"

            });


        if (!queueEntry) {

            return res.status(404).json({
                message:
                    "Queue entry not found"
            });

        }


        const cancelledPosition =
            queueEntry.position;


        // Cancel queue entry

        queueEntry.status =
            "Cancelled";


        await queueEntry.save();


        // Shift remaining users

        await Queue.updateMany(

            {
                stationId:
                    queueEntry.stationId,

                status:
                    "Waiting",

                position: {
                    $gt:
                        cancelledPosition
                }

            },

            {
                $inc: {
                    position:
                        -1
                }
            }

        );


        // Recalculate waiting time

        const remainingUsers =
            await Queue.find({

                stationId:
                    queueEntry.stationId,

                status:
                    "Waiting"

            }).sort({
                position: 1
            });


        for (
            let i = 0;
            i < remainingUsers.length;
            i++
        ) {

            remainingUsers[i]
                .position = i + 1;

            remainingUsers[i]
                .estimatedWaitTime =
                (i + 1) * 30;

            await remainingUsers[i]
                .save();

        }


        // Cancellation notification

        await Notification.create({

            userId:
                req.user.userId,

            title:
                "Queue Cancelled",

            message:
                "You have been removed from the charging queue.",

            type:
                "Queue"

        });


        res.status(200).json({

            message:
                "Removed from charging queue successfully"

        });


    } catch (error) {

        res.status(500).json({

            message:
                "Failed to cancel queue",

            error:
                error.message

        });

    }

};


// ========================================
// EXPORT
// ========================================

module.exports = {

    addToQueue,

    getMyQueueStatus,

    notifyNextUser,

    cancelQueue

};