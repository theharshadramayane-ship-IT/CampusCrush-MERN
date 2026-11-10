const express = require('express');
const router = express.Router();
const { 
  adminLogin, getAllUsers, toggleBlockUser, 
  toggleMuteUser, getPublicMessages, deleteMessage, getAnalytics 
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

router.post('/login', adminLogin);

// Protected Routes (Token zaroori hai)
router.get('/users', protect, getAllUsers);
router.put('/block/:id', protect, toggleBlockUser);
router.put('/mute/:id', protect, toggleMuteUser);

// Chat Moderation Routes
router.get('/messages', protect, getPublicMessages);
router.delete('/messages/:id', protect, deleteMessage);

// Analytics Route
router.get('/analytics', protect, getAnalytics);

module.exports = router;