const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    shopname: { type: String, required: true },
    address: { type: String, required: true },
    owner: { type: String , required: true},
    phone: { type: String, required: true },
    type: { type: String, required: true },
});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;