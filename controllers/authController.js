const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
        const { email, password } = req.body;
        const isExist = await AuthModal.findOne({ email });
        if (!isExist) res.json({ message: "A user with this email is not exist" });

        await bcrypt.compare(password, isExist.password, async (err, result) => {
            if (result) {
                const token = await jwt.sign({ email }, process.env.JWT_KEY, { expiresIn: '1d' });
                res.status(200).json({ success: true, token })
            } else res.status(404).json({ success: false, message: "Password is incorrect" });
        })

    } catch (error) {
        console.log(error);
    }
}

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

module.exports = { getRegisterAdmin, getLoginAdmin, getUserDetails }