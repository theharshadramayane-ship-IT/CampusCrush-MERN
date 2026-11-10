const express = require('express');
const router = express.Router();
const { sendMessage, getConversation } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.post('/send', protect, sendMessage);
router.get('/:userId', protect, getConversation);

module.exports = router;