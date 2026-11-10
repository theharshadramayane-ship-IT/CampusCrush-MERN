const express = require('express');
const router = express.Router();
const { getLeaderboard, applyForRole } = require('../controllers/userController');

router.get('/leaderboard', getLeaderboard);
router.post('/apply-role', applyForRole);
router.get('/profile/:email', getUserProfile);
module.exports = router;