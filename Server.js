require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

app.use('/api/auth', require('./routes/Auth'));
app.use('/api/users', require('./routes/Users'));
app.use('/api/customers', require('./routes/Customer'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 3000

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`)
})
