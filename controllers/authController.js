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
                const token = await jwt.sign({ email }, process.env.JWT_KEY);
                res.status(200).json({ success: true, token })
            } else res.status(404).json({ success: false, message: "Password is incorrect" });
        })

    } catch (error) {
        console.log(error);
    }
}

module.exports = { getRegisterAdmin, getLoginAdmin }