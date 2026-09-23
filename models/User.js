const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },

        userid: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },

        type: {
            type: String,
            enum: ['admin', 'salesman', 'manager'],
            required: true,
        },

        location: {
            latitude: {
                type: Number,
                default: null,
            },

            longitude: {
                type: Number,
                default: null,
            },

            updatedAt: {
                type: Date,
                default: null,
            },
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;