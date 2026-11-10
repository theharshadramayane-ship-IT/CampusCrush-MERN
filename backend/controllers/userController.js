const User = require('../models/User');

// 🔥 1. Leaderboard (Top Students by Points)
const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ role: 'student' })
      .sort({ points: -1 })
      .limit(10)
      .select('name branch points certificates');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔥 2. Apply for Role (Student se Coordinator/GS banne ke liye)
const applyForRole = async (req, res) => {
  try {
    const { email, requestedRole } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role !== 'student') return res.status(400).json({ error: 'You already have a role' });
    if (user.roleStatus === 'pending') return res.status(400).json({ error: 'Request already pending' });

    user.requestedRole = requestedRole;
    user.roleStatus = 'pending';
    await user.save();

    res.json({ success: true, message: 'Request sent to Admin successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔥 3. Get User Profile by Email (Profile page ke liye)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getLeaderboard, applyForRole, getUserProfile };