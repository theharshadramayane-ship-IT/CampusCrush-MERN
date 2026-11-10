const express = require('express');
const router = express.Router();
const { getDiscoverUsers, getProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/discover', protect, getDiscoverUsers);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;