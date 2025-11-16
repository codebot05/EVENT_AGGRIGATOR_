const mongoose = require('mongoose');

// Define the student schema
const studentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // AI/ML Enhancement Fields
  interests: {
    type: [String],
    default: [],
    enum: ['Technology', 'Sports', 'Arts', 'Music', 'Business', 'Science', 'Literature', 'Gaming', 'Social', 'Environment', 'Health', 'Education', 'Other']
  },
  eventHistory: [{
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    },
    action: {
      type: String,
      enum: ['viewed', 'registered', 'attended'],
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  preferences: {
    notificationsEnabled: {
      type: Boolean,
      default: true
    },
    recommendationsEnabled: {
      type: Boolean,
      default: true
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
