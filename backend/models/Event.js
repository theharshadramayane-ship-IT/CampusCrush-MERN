const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  venue: { type: String, required: true },
  image: { type: String, default: '🎉' },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  coordinators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // 🔥 Naya
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);