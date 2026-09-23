const express = require('express')
const router = express.Router()

const Location = require('../models/Location')
const User = require('../models/User')

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
    const { latitude, longitude } = req.query

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

    const adminLat = Number(latitude)
    const adminLng = Number(longitude)

    const result = users.map(user => {
      if (!user.location) {
        return {
          ...user,
          location: null,
          distance: null,
        }
      }

      const lat = user.location.latitude
      const lng = user.location.longitude

      let distance = null

      if (!isNaN(adminLat) && !isNaN(adminLng)) {
        const R = 6371
        const dLat = ((lat - adminLat) * Math.PI) / 180
        const dLng = ((lng - adminLng) * Math.PI) / 180

        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos((adminLat * Math.PI) / 180) *
            Math.cos((lat * Math.PI) / 180) *
            Math.sin(dLng / 2) ** 2

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

        distance = Number((R * c).toFixed(2))
      }

      return {
        ...user,
        location: {
          latitude: lat,
          longitude: lng,
          updatedAt: user.location.updatedAt,
        },
        distance,
      }
    })

    res.json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Failed to load locations',
    })
  }
})

module.exports = router