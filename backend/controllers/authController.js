const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register user
const signup = async (req, res) => {
  try {
    const { name, email, password, gender, branch, age } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({
      name, email, password, gender, branch, age
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id, name: user.name, email: user.email,
        gender: user.gender, branch: user.branch, age: user.age
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Update online status
    user.online = true;
    await user.save();

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id, name: user.name, email: user.email,
        gender: user.gender, branch: user.branch, age: user.age,
        bio: user.bio, interests: user.interests, profilePhoto: user.profilePhoto
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { signup, login };