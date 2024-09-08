const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');

exports.getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({  error:error.message });
    }
});

exports.getUserById = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id); 
        if (!user) {
            return res.status(404).json({ message: "User not found!" }); 
        }
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({  error:error.message });
    }
});

exports.updateUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found!" }); 
        }
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error:error.message });
    }
});

exports.deleteUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id); 
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        res.json({ message: "User deleted successfully." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error:error.message });
    }
});
