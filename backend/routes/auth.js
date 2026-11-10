const express = require('express');
const router = express.Router();
const { signup, login, addFakeUsers } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/add-fake-users', addFakeUsers);

module.exports = router;