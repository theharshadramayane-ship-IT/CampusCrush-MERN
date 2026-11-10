const Message = require('../models/Message');

const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const newMessage = await Message.create({
      sender: req.user._id, receiver: receiverId, message
    });

    const io = req.app.get('io');
    io.to(receiverId).emit('receiveMessage', {
      senderId: req.user._id, message, timestamp: newMessage.createdAt
    });

    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getConversation = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { sendMessage, getConversation };