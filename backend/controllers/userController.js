const User = require('../models/User');

// 🔥 NAYA: Leaderboard (Top Students by Points)
const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ role: 'student' })
      .sort({ points: -1 })
      .limit(10)
      .select('name branch points certificates');
    res.json(users);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// 🔥 NAYA: Apply for a Role (GS, Secretary, etc.)
const applyForRole = async (req, res) => {
  try {
    const { email, requestedRole } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role !== 'student') return res.status(400).json({ error: 'You already have a role' });

    user.requestedRole = requestedRole;
    user.roleStatus = 'pending';
    await user.save();

    res.json({ success: true, message: 'Request sent to Admin!' });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

module.exports = { getLeaderboard, applyForRole };