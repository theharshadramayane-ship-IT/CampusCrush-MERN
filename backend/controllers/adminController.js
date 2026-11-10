const User = require('../models/User');
const PublicMessage = require('../models/PublicMessage');
const Event = require('../models/Event');
const generateToken = require('../utils/generateToken');

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Access Denied. You are not an Admin.' });
    }
    if (await user.matchPassword(password)) {
      res.json({ success: true, token: generateToken(user._id), user: { id: user._id, name: user.name, role: user.role } });
    } else {
      res.status(400).json({ error: 'Invalid password' });
    }
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// Get Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// Toggle Block
const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ success: true, message: `User ${user.isBlocked ? 'Blocked' : 'Unblocked'}` });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// 🔥 NAYA: Approve/Reject Role Request & Add Certificate
const handleRoleRequest = async (req, res) => {
  try {
    const { userId, action } = req.body;
    const user = await User.findById(userId);
    
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (action === 'approve') {
      user.role = user.requestedRole;
      user.roleStatus = 'approved';
      // Role milne par certificate aur points do
      user.certificates.push({ title: `${user.requestedRole.toUpperCase()} Certificate` });
      user.points += 100; 
    } else {
      user.roleStatus = 'rejected';
    }
    
    user.requestedRole = null;
    await user.save();
    res.json({ success: true, message: `Role ${action}d successfully` });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// 🔥 NAYA: Assign Coordinator to an Event
const assignCoordinator = async (req, res) => {
  try {
    const { eventId, userId } = req.body;
    const event = await Event.findById(eventId);
    
    if (!event.coordinators.includes(userId)) {
      event.coordinators.push(userId);
      await event.save();
      
      // Coordinator ko points do
      await User.findByIdAndUpdate(userId, { $inc: { points: 50 } });
    }
    res.json({ success: true, message: 'Coordinator assigned!' });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// Chat Moderations (Purane wale)
const toggleMuteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isChatMuted = !user.isChatMuted;
    await user.save();
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getPublicMessages = async (req, res) => {
  try {
    const messages = await PublicMessage.find().sort({ createdAt: -1 }).limit(100);
    res.json(messages);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const deleteMessage = async (req, res) => {
  try {
    await PublicMessage.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMessages = await PublicMessage.countDocuments();
    const totalEvents = await Event.countDocuments();
    res.json({ totalUsers, totalMessages, totalEvents });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

module.exports = { 
  adminLogin, getAllUsers, toggleBlockUser, toggleMuteUser, 
  getPublicMessages, deleteMessage, getAnalytics, handleRoleRequest, assignCoordinator 
};