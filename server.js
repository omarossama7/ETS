require('dotenv').config();
console.log('Loaded MONGO_URI:', process.env.MONGO_URI);
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes')
const connectDB = require('./config/db');
const app = express();

connectDB();

app.use(express.json());

app.use('/api/v1/users', userRoutes);     // /api/v1/users/register
app.use('/api/v1/events', eventRoutes);   // /api/v1/events/:id


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
