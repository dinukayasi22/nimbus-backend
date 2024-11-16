// routes/adminPanel.js
const express = require('express');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Flight = require('../models/Flight');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const router = express.Router();

// Register New Admin
router.post('/register', auth, async (req, res) => {
    const { email, password } = req.body;
    const newAdmin = new Admin({ email, password });
    await newAdmin.save();
    res.status(201).send('Admin registered');
});


// Edit User
router.put('/users/:id', auth, async (req, res) => {
    const { email, password } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { email, password }, { new: true });
    res.json(updatedUser);
});


// Get All Users
router.get('/users', auth, async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.json(users);
    } catch (error) {
        res.status(500).send('Error fetching users');
    }
});

// Delete User
router.delete('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).send('User deleted successfully');
    } catch (error) {
        res.status(500).send('Error deleting user');
    }
});

// Get All Flights
router.get('/flights', auth, async (req, res) => {
    const flights = await Flight.find();
    res.json(flights);
});

// Add Flight
router.post('/flights', auth, async (req, res) => {
    const { from, to, departDate, returnDate, flightType, firstClassPrice, businessClassPrice, economyClassPrice } = req.body;

    // Validate required fields
    if (!from || !to || !departDate || !firstClassPrice || !businessClassPrice || !economyClassPrice || !flightType) {
        return res.status(400).send('Please fill in all required fields.');
    }

    // Create a new flight
    const newFlight = new Flight({
        from,
        to,
        departDate,
        returnDate,
        flightType, // Include flightType
        firstClassSeats: 20,
        businessClassSeats: 30,
        economyClassSeats: 70,
        firstClassPrice,
        businessClassPrice,
        economyClassPrice
    });

    try {
        await newFlight.save();
        res.status(201).json(newFlight); // Return the created flight object
    } catch (error) {
        console.error('Error adding flight:', error);
        res.status(500).send('Error adding flight. Please try again.');
    }
});

// Edit Flight
router.put('/flights/:id', auth, async (req, res) => {
    const updatedFlight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedFlight);
});

// Delete Flight
router.delete('/flights/:id', auth, async (req, res) => {
    try {
        await Flight.findByIdAndDelete(req.params.id);
        res.status(200).send('Flight deleted successfully');
    } catch (error) {
        res.status(500).send('Error deleting flight');
    }
});

// Get All Feedback
router.get('/feedback', auth, async (req, res) => {
    const feedbacks = await Feedback.find().populate('user', 'firstName lastName');
    res.json(feedbacks);
});


   // Get All Bookings
   router.get('/bookings', auth, async (req, res) => {
    try {
        const bookings = await Booking.find().populate('user flight');
        res.json(bookings);
    } catch (error) {
        res.status(500).send('Error fetching bookings');
    }
});

module.exports = router;