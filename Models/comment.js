// models/Comment.js

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  todo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Todo',
    required: true
  },

  by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  text: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

module.exports = mongoose.model('Comment', commentSchema);
