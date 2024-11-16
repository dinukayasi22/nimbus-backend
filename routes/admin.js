// routes/admin.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const auth = require('../middleware/auth');
const router = express.Router();

// Register Admin
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const newAdmin = new Admin({ firstName, lastName, email, password });
    await newAdmin.save();
    res.status(201).send('Admin registered');
});

// Login Admin
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).send('Admin not found');

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(400).send('Invalid credentials');

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
    res.json({ token });
});



module.exports = router;