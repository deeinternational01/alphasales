const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Register a new user
router.post('/register', async (req, res) => {
    const { username, userid, password, type } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ userid });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            userid,
            password: hashedPassword,
            type,
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Login a user with user type
router.post('/login', async (req, res) => {
    const { userid, password } = req.body;

    try {
        // Find the user by userid
        const user = await User.findOne({ userid });
        if (!user) {
            return res.status(400).json({ message: 'Invalid userid or password' });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid userid or password' });
        }

        // Return user type on successful login
        res.status(200).json({ message: 'Login successful', type: user.type });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;