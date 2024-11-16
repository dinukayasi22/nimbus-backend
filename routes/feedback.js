const express = require('express');
const Feedback = require('../models/Feedback');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Submit Feedback
router.post('/', auth, async (req, res) => {
    const { title, message, rating } = req.body;
    const newFeedback = new Feedback({ user: req.user.id, title, message, rating });
    await newFeedback.save();
    res.status(201).send('Feedback submitted');
});

// Get All Feedbacks
router.get('/', async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        res.json(feedbacks);
    } catch (error) {
        res.status(500).send('Error fetching feedbacks');
    }
});

module.exports = router;