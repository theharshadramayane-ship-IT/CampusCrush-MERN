const User = require('../models/User');
const PublicMessage = require('../models/PublicMessage');
const generateToken = require('../utils/generateToken');

// Admin Login (Purana wala)
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Access Denied. You are not an Admin.' });
    }
    if (await user.matchPassword(password)) {
      res.json({
        success: true,
        token: generateToken(user._id),
        user: { id: user._id, name: user.name, role: user.role }
      });
    } else {
      res.status(400).json({ error: 'Invalid password' });
    }
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// Saare Students Dekhna (Purana wala)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// Student ko Block/Unblock Karna (Purana wala)
const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ success: true, message: `User ${user.isBlocked ? 'Blocked' : 'Unblocked'}` });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// 🔥 NAYA: User ko Chat se Mute/Unmute Karna
const toggleMuteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isChatMuted = !user.isChatMuted;
    await user.save();
    res.json({ success: true, message: `User ${user.isChatMuted ? 'Muted' : 'Unmuted'}` });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// 🔥 NAYA: Saare Public Chat Messages Dekhna
const getPublicMessages = async (req, res) => {
  try {
    const messages = await PublicMessage.find().sort({ createdAt: -1 }).limit(100);
    res.json(messages);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// 🔥 NAYA: Chat Message Delete Karna
const deleteMessage = async (req, res) => {
  try {
    await PublicMessage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// 🔥 NAYA: Analytics/Stats Fetch Karna
const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMessages = await PublicMessage.countDocuments();
    const totalMatches = 0; // Abhi match system DB mein nahi hai, toh 0
    
    res.json({ totalUsers, totalMessages, totalMatches });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

module.exports = { 
  adminLogin, getAllUsers, toggleBlockUser, 
  toggleMuteUser, getPublicMessages, deleteMessage, getAnalytics 
};