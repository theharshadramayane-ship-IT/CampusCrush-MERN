const Match = require('../models/Match');

const likeUser = async (req, res) => {
  try {
    const { likedUserId, action } = req.body;

    if (action === 'pass') return res.json({ matched: false, message: 'Passed' });

    const existingMatch = await Match.findOne({
      user1: likedUserId, user2: req.user._id, status: 'pending'
    });

    if (existingMatch) {
      existingMatch.status = 'matched';
      await existingMatch.save();
      await Match.create({ user1: req.user._id, user2: likedUserId, status: 'matched' });
      return res.json({ matched: true, message: "It's a match! 💘" });
    }

    await Match.create({ user1: req.user._id, user2: likedUserId, status: 'pending' });
    res.json({ matched: false, message: 'Liked! ❤️' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMyMatches = async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [{ user1: req.user._id }, { user2: req.user._id }],
      status: 'matched'
    }).populate('user1', 'name profilePhoto branch').populate('user2', 'name profilePhoto branch');

    const matchedUsers = matches.map(m => 
      m.user1._id.toString() === req.user._id.toString() ? m.user2 : m.user1
    );
    res.json(matchedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { likeUser, getMyMatches };