const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['Party', 'Tech', 'Music', 'Sports', 'Study'], required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  spots: { type: Number, required: true },
  image: { type: String, default: '🎉' },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);