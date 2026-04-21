const mongoose = require('mongoose');

const GestureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    default: "None",
  },
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
  },
  user: {
    type: String, // Storing initial for easy UI rendering
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Gesture', GestureSchema);
