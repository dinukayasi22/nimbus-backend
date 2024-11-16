// routes/flight.js
const express = require('express');
const Flight = require('../models/Flight');
const router = express.Router();

// Add Flight
router.post('/', async (req, res) => {
    const {
        from,
        to,
        departDate,
        returnDate,
        flightType, // New field for flight type
        firstClassPrice,
        businessClassPrice,
        economyClassPrice,
        availableSeats // This can be calculated based on class seats
    } = req.body;

    const newFlight = new Flight({
        from,
        to,
        departDate,
        returnDate,
        flightType,
        firstClassPrice,
        businessClassPrice,
        economyClassPrice,
        availableSeats: 120, // Default total seats
        firstClassSeats: 20, // Default first class seats
        businessClassSeats: 30, // Default business class seats
        economyClassSeats: 70 // Default economy class seats
    });

    await newFlight.save();
    res.status(201).send('Flight added');
});

// Get All Flights
router.get('/', async (req, res) => {
    try {
        const flights = await Flight.find();
        res.json(flights);
    } catch (error) {
        res.status(500).send('Error fetching flights');
    }
});

// Get Flight by ID
router.get('/:id', async (req, res) => {
    const flight = await Flight.findById(req.params.id);
    if (!flight) return res.status(404).send('Flight not found');
    res.json(flight);
});

// Delete Flight
router.delete('/:id', async (req, res) => {
    try {
        await Flight.findByIdAndDelete(req.params.id);
        res.status(200).send('Flight deleted successfully');
    } catch (error) {
        res.status(500).send('Error deleting flight');
    }
});

module.exports = router;