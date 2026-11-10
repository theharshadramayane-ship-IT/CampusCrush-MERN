const Event = require('../models/Event');

const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('attendees', 'name');
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    if (event.attendees.includes(req.user._id)) {
      return res.status(400).json({ error: 'Already joined' });
    }

    event.attendees.push(req.user._id);
    await event.save();
    res.json({ success: true, message: 'Joined event! 🎉' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Sample Events Create Karne Ke Liye
const createSampleEvents = async (req, res) => {
  try {
    const sampleEvents = [
      { title: '🎨 Freshers Party', category: 'Party', date: 'Aug 15', time: '7 PM', venue: 'Auditorium', spots: 50, image: '🎉' },
      { title: '💻 Hackathon', category: 'Tech', date: 'Aug 20', time: '9 AM', venue: 'CS Dept', spots: 20, image: '💻' },
      { title: '🎵 Open Mic', category: 'Music', date: 'Aug 22', time: '6 PM', venue: 'Cafeteria', spots: 30, image: '🎤' }
    ];

    for (const e of sampleEvents) {
      const exists = await Event.findOne({ title: e.title });
      if (!exists) await Event.create(e);
    }
    res.json({ message: 'Sample events created!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getEvents, joinEvent, createSampleEvents };