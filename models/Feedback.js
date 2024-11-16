   // models/Feedback.js
   const mongoose = require('mongoose');

   const feedbackSchema = new mongoose.Schema({
       user: {
           type: mongoose.Schema.Types.ObjectId,
           ref: 'User',
           required: true
       },
       title: {
           type: String,
           required: true,
           trim: true
       },
       message: {
           type: String,
           required: true
       },
       rating: {
           type: Number,
           required: true,
           min: 1,
           max: 5
       }
   }, {
       timestamps: true
   });

   module.exports = mongoose.model('Feedback', feedbackSchema);