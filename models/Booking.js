const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    flight: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight',
        required: true
    },
    seatNumber: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    bookingNumber: {
        type: String,
        required: true,
        unique: true
    },
    classType: {
        type: String,
        enum: ['First Class', 'Business Class', 'Economy Class'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);