const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser
} = require("../controllers/authController");

const User = require("../models/User");

const authMiddleware =
    require("../middleware/authMiddleware");


router.post(
    "/register",
    registerUser
);


router.post(
    "/login",
    loginUser
);


// ========================================
// GET USER PROFILE
// ========================================

router.get(
    "/profile",
    authMiddleware,
    async (req, res) => {

        try {

            const user =
                await User.findById(
                    req.user.userId
                ).select("-password");


            if (!user) {

                return res.status(404).json({
                    message:
                        "User not found"
                });

            }


            res.status(200).json({

                message:
                    "Profile fetched successfully",

                user

            });


        } catch (error) {

            res.status(500).json({

                message:
                    "Failed to fetch profile",

                error:
                    error.message

            });

        }

    }
);


module.exports = router;