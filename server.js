// server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const flightRoutes = require('./routes/flight');
const feedbackRoutes = require('./routes/feedback');
const bookingRoutes = require('./routes/booking');
const adminPanelRoutes = require('./routes/adminPanel');
const dotenv = require('dotenv');


dotenv.config();
const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminPanelRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});