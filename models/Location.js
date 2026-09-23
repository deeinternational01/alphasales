const mongoose = require('mongoose')

const Location = mongoose.model('Location', new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    latitude: Number,
    longitude: Number,

    updatedAt: {
        type: Date,
        default: Date.now,
    },
})
)

module.exports = Location