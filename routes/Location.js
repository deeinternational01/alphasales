const express = require('express')
const router = express.Router()
const Location = require('../models/Location')

router.post('/update', async (req, res) => {
  try {
    const { userId, latitude, longitude } = req.body

    const location = await Location.findOneAndUpdate(
      { userId },
      {
        latitude,
        longitude,
        updatedAt: new Date(),
      },
      {
        new: true,
        upsert: true,
      }
    )

    res.json({
      message: 'Location updated',
      location,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Location failed' })
  }
})

router.get('/locations', async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'locations',
          localField: '_id',
          foreignField: 'userId',
          as: 'location',
        },
      },
      {
        $project: {
          username: 1,
          userid: 1,
          type: 1,
          location: {
            $arrayElemAt: ['$location', -1],
          },
        },
      },
    ])

    res.json(
      users.map(user => ({
        ...user,
        location: user.location
          ? {
              latitude: user.location.latitude,
              longitude: user.location.longitude,
              updatedAt: user.location.updatedAt,
            }
          : null,
      }))
    )
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Failed to load locations' })
  }
})

module.exports = router