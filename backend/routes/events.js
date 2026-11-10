const express = require('express');
const router = express.Router();
const { getEvents, joinEvent, createSampleEvents } = require('../controllers/eventController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getEvents);
router.post('/:id/join', protect, joinEvent);
router.post('/create-sample', protect, createSampleEvents);

module.exports = router;