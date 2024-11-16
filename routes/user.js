const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth'); // Make sure to create this middleware
const router = express.Router();

// Existing routes
router.post('/register', async (req, res) => {
    const { firstName, middleName, lastName, email, gender, passportNumber, mobileNo, country, password } = req.body;
    const newUser = new User({ firstName, middleName, lastName, email, gender, passportNumber, mobileNo, country, password });
    await newUser.save();
    res.status(201).send('User registered');
});

router.post('/login', async (req, res) => {
  try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).send('User not found');

      const isMatch = await user.comparePassword(password);
      if (!isMatch) return res.status(400).send('Invalid credentials');

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      
      // Send user data (excluding password) along with token
      const userData = user.toObject();
      delete userData.password;
      
      res.json({ token, user: userData });
  } catch (error) {
      res.status(500).send('Error during login');
  }
});

// New routes for profile management
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).send('Error fetching profile');
    }
});

router.put('/update', auth, async (req, res) => {
    try {
        const { firstName, middleName, lastName, email, gender, passportNumber, mobileNo, country } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { firstName, middleName, lastName, email, gender, passportNumber, mobileNo, country },
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).send('Error updating profile');
    }
});

router.put('/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).send('Current password is incorrect');
        }

        user.password = newPassword;
        await user.save();
        
        res.send('Password updated successfully');
    } catch (error) {
        res.status(500).send('Error changing password');
    }
});

// Existing admin routes
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).send('Error fetching users');
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).send('User deleted successfully');
    } catch (error) {
        res.status(500).send('Error deleting user');
    }
});

module.exports = router;