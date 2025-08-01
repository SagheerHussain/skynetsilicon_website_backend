const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

require("dotenv").config();

const AuthModal = require("../modals/AuthModal");

const getRegisterAdmin = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const isExist = await AuthModal.findOne({ email });
        if (isExist) res.json({ message: "A user with this email is already exist" });

        await bcrypt.genSalt(10, async (err, salt) => {
            await bcrypt.hash(password, salt, async (err, hash) => {
                const newUser = await AuthModal.create({ username, email, password: hash });
                res.json({ success: true, user: newUser })
            })
        })

    } catch (error) {
        console.log(error);
    }
}

const getLoginAdmin = async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;

        console.log("Login Attempt:", emailOrUsername, password);
        const user = await AuthModal.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: "Incorrect password" });
        }

        const token = jwt.sign({ email: user.email }, process.env.JWT_KEY, { expiresIn: "1d" });

        res.status(200).json({ success: true, token });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


const getUserDetails = async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token) return res.status(401).json({ success: false, message: "No token provided" });

        await jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
            if (err) return res.status(401).json({ success: false, message: "Invalid or expired token" });

            const user = await AuthModal.findOne({ email: decoded.email }).select("-password");
            if (!user) return res.status(404).json({ success: false, message: "User does not exist" });

            res.status(200).json({ success: true, user, tokenExpiresIn: decoded.exp });
        });
    } catch (error) {
        res.status(404).json({ success: false, message: "User is not exist" });
    }
}

const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await AuthModal.findOne({ email });
        if (!user) res.status(404).json({ message: "User is not exist", success: false });
        else {
            const token = await jwt.sign({ email }, process.env.JWT_KEY, { expiresIn: "1d" });

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                secure: true,
                auth: {
                    user: `${process.env.MY_GMAIL}`,
                    pass: `${process.env.MY_PASSWORD}`
                }
            });

            const mailOptions = {
                from: `${process.env.MY_GMAIL}`,
                to: email,
                subject: 'Reset Your Password',
                text: `Click on this link to reset your password : https://www.skynetsilicon.com/reset-password/${token}`
            };

            await transporter.sendMail(mailOptions);

            res.status(200).json({ message: "Verification Link Has Been Send To Your Email", success: true });
        }
    } catch (error) {
        res.status(404).json({ message: "Something Went Wrong", success: false });
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const decode = await jwt.verify(token, process.env.JWT_KEY);
        console.log(token, password, decode)
        const user = await AuthModal.findOne({ email: decode.email });

        if (user) {
            const newpassword = await bcrypt.hash(password, 12);
            const updatedUser = await AuthModal.findOneAndUpdate({ email: decode.email }, { password: newpassword });
            updatedUser.save();
            res.status(200).json({ message: "Password Has Been Saved Succcessfully", success: true });
        } else {
            res.status(200).json({ message: "User not found", success: false });
        }

    } catch (error) {
        res.status(404).json({ message: "Something Went Wrong", success: false });
    }
}

module.exports = { getRegisterAdmin, getLoginAdmin, getUserDetails, forgetPassword, resetPassword }