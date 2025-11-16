//collegeRoutes.js file
const express = require('express');
const College = require('../models/College');
const router = express.Router();

// Register a new college
router.post('/', async (req, res) => {
  const { college_id, college_name, email, location, password_hash } = req.body;
  try {
    const newCollege = new College({
      college_id,
      college_name,
      email,
      location,
      password_hash,
    });

    await newCollege.save();
    res.status(201).json({ message: 'College registered successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: err });
  }
});

// Get all colleges
router.get('/', async (req, res) => {
  try {
    const colleges = await College.find();
    res.status(200).json(colleges);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch colleges', details: err });
  }
});

//  Get a college by ID
router.get('/:collegeId', async (req, res) => {
  try {
    const college = await College.findById(req.params.collegeId);
    if (!college) {
      return res.status(404).json({ error: 'College not found' });
    }
    res.status(200).json(college);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch college', details: err });
  }
});

// Update a college
router.put('/:collegeId', async (req, res) => {
  try {
    const updatedCollege = await College.findByIdAndUpdate(
      req.params.collegeId,
      req.body,
      { new: true }
    );
    if (!updatedCollege) {
      return res.status(404).json({ error: 'College not found' });
    }
    res.status(200).json(updatedCollege);
  } catch (err) {
    res.status(500).json({ error: 'Unable to update college', details: err });
  }
});

// Delete a college
router.delete('/:collegeId', async (req, res) => {
  try {
    const deletedCollege = await College.findByIdAndDelete(req.params.collegeId);
    if (!deletedCollege) {
      return res.status(404).json({ error: 'College not found' });
    }
    res.status(200).json({ message: 'College deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Unable to delete college', details: err });
  }
});

module.exports = router;
