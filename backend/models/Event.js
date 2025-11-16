const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String, 
    required: true,
  },
  event_id: {
    type: String,
    unique: true,
    default: uuidv4,
  },
  location: {
    type: String,
    required: true,
  },
  eventCategory: {
    type: String, 
    required: true,
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',  // Reference to the College model
    required: true,
  },
  eventImage: {
    type: String,  // This will store the file path of the uploaded image
    required: false  // Image is optional when creating an event
  },
  registrationLink: {
    type: String,  // Registration link for the event
    required: false,  // This field can be optional
  },
  participants: {
    type: [mongoose.Schema.Types.ObjectId], // Assuming you're storing participants as ObjectIds
    default: [] // Default value as an empty array
  },
  // AI/ML Enhancement Fields
  tags: {
    type: [String],
    default: []
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
    default: 'All Levels'
  },
  ratings: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    review: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  viewCount: {
    type: Number,
    default: 0
  },
  popularity: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
