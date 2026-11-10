const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// Signup
const signup = async (req, res) => {
  try {
    const { name, email, password, gender, branch, age } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({ name, email, password, gender, branch, age });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id, name: user.name, email: user.email,
        gender: user.gender, branch: user.branch, age: user.age
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid password' });

    user.online = true;
    await user.save();

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id, name: user.name, email: user.email,
        gender: user.gender, branch: user.branch, age: user.age,
        bio: user.bio, interests: user.interests, profilePhoto: user.profilePhoto
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fake Users Add (Testing ke liye)
const addFakeUsers = async (req, res) => {
  try {
    const fakeUsers = [
      { name: 'Priya Sharma', email: 'priya@test.com', password: '123456', gender: 'Girl', branch: 'CS', age: 21, bio: 'Coding enthusiast' },
      { name: 'Rahul Verma', email: 'rahul@test.com', password: '123456', gender: 'Boy', branch: 'ECE', age: 22, bio: 'Football player' },
      { name: 'Anjali Nair', email: 'anjali@test.com', password: '123456', gender: 'Girl', branch: 'IT', age: 20, bio: 'Nature lover' }
    ];

    for (const u of fakeUsers) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) await User.create(u);
    }
    res.json({ message: 'Fake users added!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { signup, login, addFakeUsers };