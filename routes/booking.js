const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Flight = require('../models/Flight');
const Booking = require('../models/Booking');

// Helper function to generate booking number
const generateBookingNumber = () => {
    return 'BK' + Date.now().toString().slice(-8) + Math.random().toString(36).slice(-4).toUpperCase();
};

// Get booked seats for a flight
router.get('/booked-seats/:flightId', async (req, res) => {
    try {
        const bookings = await Booking.find({ 
            flight: req.params.flightId 
        }).select('seatNumber classType -_id');
        
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching booked seats:', error);
        res.status(500).send('Error fetching booked seats');
    }
});

// Create new booking
router.post('/', auth, async (req, res) => {
    const { flightId, classType, seatNumber } = req.body;

    try {
        // Find the flight
        const flight = await Flight.findById(flightId);
        if (!flight) {
            return res.status(404).send('Flight not found');
        }

        // Check if seat is already booked
        const existingBooking = await Booking.findOne({
            flight: flightId,
            seatNumber: seatNumber
        });

        if (existingBooking) {
            return res.status(400).send('This seat is already booked');
        }

        // Validate seat class matches the selected class
        const seatPrefix = seatNumber.charAt(0);
        const validPrefixes = {
            'First Class': 'F',
            'Business Class': 'B',
            'Economy Class': 'E'
        };

        if (seatPrefix !== validPrefixes[classType]) {
            return res.status(400).send('Selected seat does not match the chosen class');
        }

        // Calculate total price based on class
        let totalPrice;
        let seatsField;

        switch (classType) {
            case 'First Class':
                totalPrice = flight.firstClassPrice;
                seatsField = 'firstClassSeats';
                break;
            case 'Business Class':
                totalPrice = flight.businessClassPrice;
                seatsField = 'businessClassSeats';
                break;
            case 'Economy Class':
                totalPrice = flight.economyClassPrice;
                seatsField = 'economyClassSeats';
                break;
            default:
                return res.status(400).send('Invalid class type');
        }

        // Check if seats are available
        if (flight[seatsField] <= 0) {
            return res.status(400).send(`No available seats in ${classType}`);
        }

        // Create new booking
        const newBooking = new Booking({
            user: req.user.id,
            flight: flightId,
            seatNumber,
            totalPrice,
            classType,
            bookingNumber: generateBookingNumber()
        });

        // Update flight seats
        flight[seatsField] -= 1;

        // Save both booking and updated flight
        await Promise.all([
            newBooking.save(),
            flight.save()
        ]);

        // Return booking details
        res.status(201).json({
            message: 'Booking created successfully',
            booking: {
                bookingNumber: newBooking.bookingNumber,
                seatNumber: newBooking.seatNumber,
                classType: newBooking.classType,
                totalPrice: newBooking.totalPrice
            }
        });

    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).send('Error creating booking');
    }
});

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('flight', 'from to departDate returnDate flightType')
            .sort('-createdAt');
        
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).send('Error fetching bookings');
    }
});

module.exports = router;