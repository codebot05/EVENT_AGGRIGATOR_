const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');


// Define the college schema
const collegeSchema = new mongoose.Schema({
  college_id: {
    type: String,
    unique: true,
    default: uuidv4 
  },
  collegeName: {
    type: String,
    required: true,
    unique: true,
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
  location: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('College', collegeSchema);
