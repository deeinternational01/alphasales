const express = require('express');
const router = express.Router();

const User = require('../models/User');

router.post('/', async (req, res) => {
    try {
        const {
            userid,
            latitude,
            longitude,
        } = req.body;

        if (!userid) {
            return res.status(400).json({
                message: 'userid is required',
            });
        }

        if (
            latitude === undefined ||
            longitude === undefined
        ) {
            return res.status(400).json({
                message: 'latitude and longitude are required',
            });
        }

        const user = await User.findOne({ userid });

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        user.location = {
            latitude: Number(latitude),
            longitude: Number(longitude),
            updatedAt: new Date(),
        };

        await user.save();

        res.json({
            success: true,
            message: 'Location updated',
            user: {
                userid: user.userid,
                username: user.username,
                type: user.type,
                location: user.location,
            },
        });

    } catch (error) {
        console.error('Location update error:', error);

        res.status(500).json({
            message: 'Server error',
            error: error.message,
        });
    }
});


// ==========================================
// GET ALL USER LOCATIONS
// GET /api/users/locations
// ==========================================

router.get('/', async (req, res) => {
    try {

        const users = await User.find(
            {
                'location.latitude': { $ne: null },
                'location.longitude': { $ne: null },
            },
            {
                username: 1,
                userid: 1,
                type: 1,
                location: 1,
            }
        );

        res.json({
            success: true,
            users,
        });

    } catch (error) {

        console.error('Get locations error:', error);

        res.status(500).json({
            message: 'Server error',
            error: error.message,
        });
    }
});


// ==========================================
// GET ONE USER LOCATION
// GET /api/users/location/:userid
// ==========================================

router.get('/:userid', async (req, res) => {
    try {

        const user = await User.findOne(
            { userid: req.params.userid },
            {
                username: 1,
                userid: 1,
                type: 1,
                location: 1,
            }
        );

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        res.json({
            success: true,
            user,
        });

    } catch (error) {

        res.status(500).json({
            message: 'Server error',
            error: error.message,
        });
    }
});


module.exports = router;