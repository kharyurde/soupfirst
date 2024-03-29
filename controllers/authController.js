const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const generateOtp = require("../utils/otp_generator");
const sendEmail = require('../utils/smtp_function');


module.exports = {
    createUser: async (req, res) => {
        const emailRegex = /^[a-zA-z0-9._-]+@[a-zA-z0-9._-]+\.[a-zA-Z]{2,4}$/;

        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({ status: false, message: "Invalid email address" });
        }

        const minPasswordLength = 8;

        if (req.body.password.length < minPasswordLength) {
            return res.status(400).json({ status: false, message: "Password must be at least " + minPasswordLength + " characters long" });
        }
        try {
            const emailExist = await User.findOne({ email: req.body.email });

            if (emailExist) {
                return res.status(400).json({ status: false, message: "Email already exist" });
            }
            //Generate OTP

            const otp = generateOtp();

            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                userType: 'Client',
                password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET).toString(),
                otp: otp,
        
            })

            //Save user
            await newUser.save();

            //Send OTP to email
            sendEmail(newUser.email, otp);



            res.status(201).json({ status: true, message: "User created successfully" });

        } catch (error) {
            res.status(500).json({ status: false, message: error.message });

        }
    },


    loginUser: async (req, res) => {
        const emailRegex = /^[a-zA-z0-9._-]+@[a-zA-z0-9._-]+\.[a-zA-Z]{2,4}$/;

        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({ status: false, message: "Invalid email address" });
        }

        const minPasswordLength = 8;

        if (req.body.password.length < minPasswordLength) {
            return res.status(400).json({ status: false, message: "Password must be at least " + minPasswordLength + " characters long" });
        }
        try {

            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(400).json({ status: false, message: "User not found" });
            }
            const decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET);
            const depassword = decryptedPassword.toString(CryptoJS.enc.Utf8);
            
            if (depassword !== req.body.password) {
                return res.status(400).json({ status: false, message: "Incorrect password" });
            }
            const userToken = jwt.sign({
                id: user._id,
                userType: user.userType,
                email: user.email,
            }, process.env.JWT_SECRET, { expiresIn: '21d' });

            const { password, createdAt, __v, updatedAt, otp, ...others } = user._doc;

            res.status(200).json({ ...others, userToken });
            console.log("Error fetching user:", userToken);
        } catch (error) {

            res.status(500).json({ status: false, message: error.message });

        }
    },

    resendOtp: async (req, res) => {
        const emailRegex = /^[a-zA-z0-9._-]+@[a-zA-z0-9._-]+\.[a-zA-Z]{2,4}$/;

        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({ status: false, message: "Invalid email address" });
        }

        try {
            const user = await User.findOne({ email: req.body.email });
            
            if (!user) {
                return res.status(400).json({ status: false, message: "User not found" });
            }

            // Generate a new OTP
            const otp = generateOtp();

            // Update the user's OTP in the database
            user.otp = otp;
            await user.save();

            // Send the new OTP to the user's email
            sendEmail(user.email, otp);

            return res.status(200).json({ status: true, message: "OTP resent successfully" });
        } catch (error) {
            return res.status(500).json({ status: false, message: error.message });
        }
    }

}