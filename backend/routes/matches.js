const express = require('express');
const router = express.Router();
const { likeUser, getMyMatches } = require('../controllers/matchController');
const { protect } = require('../middleware/auth');

router.post('/like', protect, likeUser);
router.get('/', protect, getMyMatches);

module.exports = router;
