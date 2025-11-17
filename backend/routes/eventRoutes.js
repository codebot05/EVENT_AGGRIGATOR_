const express = require('express');
const multer = require('multer'); 
const Event = require('../models/Event');
const User = require('../models/User');
const authenticateToken = require('../middlewares/authMiddleware');
const sendEventNotification = require('../emailnotif/sendgrid');

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/events');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});

const upload = multer({ storage: storage });  

router.post('/events', authenticateToken, upload.single('image'), async (req, res) => {
  const { eventName, description, date, time, location, eventCategory, event_id, registrationLink, isPublic } = req.body;
  const collegeId = req.user._id;
  const eventImage = req.file ? `/uploads/events/${req.file.filename}` : null;

  try {
    const newEvent = new Event({
      eventName,
      description,
      date,
      time,
      location,
      eventCategory,
      event_id,
      college: collegeId,
      eventImage,
      registrationLink,
      isPublic: isPublic === 'true' || isPublic === true  // Convert string to boolean
    });

    await newEvent.save();

    // Only send notifications for public events
    if (newEvent.isPublic) {
      const recipients = await User.find({}, "email").then(users => users.map(user => user.email));
      await sendEventNotification(newEvent, recipients);
    }

    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  }catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ message: 'Server error. Could not create event.' });
  }
});


router.get('/events/all', authenticateToken, async (req, res) => {
  console.log("Fetching events...");
  try {
    const userType = req.user.userType || (req.user.collegeName ? 'college' : 'student');
    let events;

    if (userType === 'college') {
      // Colleges see all events
      events = await Event.find();
    } else {
      // Students see:
      // 1. All public events
      // 2. Private events where they are invited
      events = await Event.find({
        $or: [
          { isPublic: true },
          { invitedStudents: req.user._id }
        ]
      });
    }

    console.log('Events fetched successfully');
    res.status(200).json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ message: 'Server error. Could not fetch events.' });
  }
});

// Get single event by ID
router.get('/events/:id', async (req, res) => {
  try {
    console.log('Fetching event with ID:', req.params.id);
    const event = await Event.findById(req.params.id).populate('college', 'collegeName location email');

    if (!event) {
      console.log('Event not found for ID:', req.params.id);
      return res.status(404).json({ message: 'Event not found' });
    }

    console.log('Event found:', event.eventName);
    res.status(200).json(event);
  } catch (err) {
    console.error('Error fetching event:', err);
    console.error('Invalid ID format:', req.params.id);
    res.status(500).json({ message: 'Server error. Could not fetch event.' });
  }
});


module.exports = router;