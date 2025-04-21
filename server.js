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

app.use('/api/users', userRoutes);
app.use('/api/v1', eventRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
