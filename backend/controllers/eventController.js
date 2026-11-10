const Event = require('../models/Event');

// Saare events laao
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Naya event banao (Sirf Admin)
const createEvent = async (req, res) => {
  try {
    const { title, date, venue, image } = req.body;
    const newEvent = await Event.create({ title, date, venue, image });
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Event delete karo (Sirf Admin)
const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Event update/edit karo (Sirf Admin)
const updateEvent = async (req, res) => {
  try {
    const { title, date, venue, image } = req.body;
    const event = await Event.findByIdAndUpdate(
      req.params.id, 
      { title, date, venue, image }, 
      { new: true }
    );
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getEvents, createEvent, deleteEvent, updateEvent };