const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    departDate: { type: Date, required: true },
    returnDate: { type: Date }, 
    flightType: {
        type: String,
        enum: ['One Way', 'Return'],
        required: true
    },
    firstClassPrice: { type: Number, required: true },
    businessClassPrice: { type: Number, required: true },
    economyClassPrice: { type: Number, required: true },
    firstClassSeats: {
        type: Number,
        required: true,
        default: 20 // 5 rows × 4 seats
    },
    businessClassSeats: {
        type: Number,
        required: true,
        default: 30 // 5 rows × 6 seats
    },
    economyClassSeats: {
        type: Number,
        required: true,
        default: 70 // 10 rows × 7 seats
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Flight', flightSchema);

