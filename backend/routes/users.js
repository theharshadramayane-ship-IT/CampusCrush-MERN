const express = require('express');
const router = express.Router();

// Controller se saare functions import karo
const { getLeaderboard, applyForRole, getUserProfile } = require('../controllers/userController');

// Routes Define Karo
router.get('/leaderboard', getLeaderboard);
router.post('/apply-role', applyForRole);
router.get('/profile/:email', getUserProfile);

module.exports = router;