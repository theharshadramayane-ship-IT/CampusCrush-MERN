const User = require('../models/User');

const getDiscoverUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, age, bio, interests } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id, { name, age, bio, interests }, { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getDiscoverUsers, getProfile, updateProfile };