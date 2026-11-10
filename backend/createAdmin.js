const dns = require('dns');
// 🔥 DNS Fix (Windows + Node.js SRV error se bachne ke liye)
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Connected to DB');
  
  const adminExists = await User.findOne({ email: 'admin@campuscrusher.com' });
  if (adminExists) {
    console.log('Admin already exists!');
    process.exit();
  }

  await User.create({
    name: 'Super Admin',
    email: 'admin@campuscrusher.com',
    password: 'admin123',
    gender: 'Boy',
    branch: 'Admin',
    age: 30,
    role: 'admin'
  });

  console.log('✅ Admin Created! Email: admin@campuscrusher.com | Pass: admin123');
  process.exit();
}).catch(err => {
  console.log('❌ Error:', err.message);
  process.exit(1);
});