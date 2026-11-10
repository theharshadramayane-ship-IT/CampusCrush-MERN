const express = require('express');
const router = express.Router();
const { getEvents, createEvent, deleteEvent, updateEvent } = require('../controllers/eventController');
const { protect } = require('../middleware/auth');

// Sab log events dekh sakte hain
router.get('/', getEvents);

// Sirf logged-in admin events add/delete/edit kar sakta hai
router.post('/', protect, createEvent);
router.delete('/:id', protect, deleteEvent);
router.put('/:id', protect, updateEvent);

module.exports = router;