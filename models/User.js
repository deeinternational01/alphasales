const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true,  unique: true },
    userid: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: { type: String , enum: ['admin', 'salesman' , 'manager'], required: true },
});

const User = mongoose.model('User', userSchema);
module.exports = User;