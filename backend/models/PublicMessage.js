const mongoose = require('mongoose');

const publicMessageSchema = new mongoose.Schema({
  user: { type: String, required: true },
  text: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('PublicMessage', publicMessageSchema);