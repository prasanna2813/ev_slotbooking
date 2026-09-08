const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ========================================
// REGISTER USER
// ========================================

const registerUser = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            vehicleNumber,
            vehicleModel,
            batteryPercentage
        } = req.body;


        // ========================================
        // REQUIRED FIELDS
        // ========================================

        if (
            !name ||
            !email ||
            !password ||
            !vehicleNumber ||
            !vehicleModel ||
            batteryPercentage === undefined
        ) {

            return res.status(400).json({
                message: "All registration fields are required"
            });

        }


        // ========================================
        // PASSWORD VALIDATION
        // ========================================

        const passwordPattern =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


        if (!passwordPattern.test(password)) {

            return res.status(400).json({

                message:
                    "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."

            });

        }


        // ========================================
        // BATTERY VALIDATION
        // ========================================

        const battery =
            Number(batteryPercentage);


        if (
            isNaN(battery) ||
            battery < 0 ||
            battery > 100
        ) {

            return res.status(400).json({

                message:
                    "Battery percentage must be between 0 and 100."

            });

        }


        // ========================================
        // CHECK EXISTING USER
        // ========================================

        const existingUser =
            await User.findOne({
                email: email.toLowerCase()
            });


        if (existingUser) {

            return res.status(400).json({

                message:
                    "User already exists"

            });

        }


        // ========================================
        // HASH PASSWORD
        // ========================================

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        // ========================================
        // CREATE USER
        // ========================================

        const user =
            await User.create({

                name: name,

                email:
                    email.toLowerCase(),

                password:
                    hashedPassword,

                vehicleNumber:
                    vehicleNumber,

                vehicleModel:
                    vehicleModel,

                batteryPercentage:
                    battery

            });


        // ========================================
        // RESPONSE
        // ========================================

        res.status(201).json({

            message:
                "User registered successfully",

            userId:
                user._id

        });


    } catch (error) {

        res.status(500).json({

            message:
                "Registration failed",

            error:
                error.message

        });

    }

};


// ========================================
// LOGIN USER
// ========================================

const loginUser = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        if (!email || !password) {

            return res.status(400).json({

                message:
                    "Email and password are required"

            });

        }


        const user =
            await User.findOne({

                email:
                    email.toLowerCase()

            });


        if (!user) {

            return res.status(400).json({

                message:
                    "User not found"

            });

        }


        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isPasswordCorrect) {

            return res.status(400).json({

                message:
                    "Invalid password"

            });

        }


        // ========================================
        // CREATE JWT
        // ========================================

        const token =
            jwt.sign(

                {
                    userId:
                        user._id
                },

                process.env.JWT_SECRET,

                {
                    expiresIn:
                        "1d"
                }

            );


        res.status(200).json({

            message:
                "Login successful",

            token:
                token,

            userId:
                user._id

        });


    } catch (error) {

        res.status(500).json({

            message:
                "Login failed",

            error:
                error.message

        });

    }

};


module.exports = {

    registerUser,

    loginUser

};