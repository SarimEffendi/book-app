const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");

const authenticate = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Token not found or not in the correct format!" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decode = jwt.verify(token, process.env.JWTSECRET);
        console.log("Decoded Token:", decode);

        if (!mongoose.Types.ObjectId.isValid(decode._id)) {
            return res.status(401).json({ message: "Invalid token ID!" });
        }

        const user = await User.findById(decode._id);
        console.log("User Retrieved:", user);

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication Error:", error);
        res.status(401).json({ error: "Invalid token!" });
    }
});

module.exports = authenticate;
