const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@techfest2026.com').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin User';
const ADMIN_PHONE = process.env.ADMIN_PHONE || '9876543210';
const ADMIN_COLLEGE = process.env.ADMIN_COLLEGE || 'TechFest Admin';

const ensureAdmin = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing in backend/.env');
  }

  if (ADMIN_PASSWORD.length < 6) {
    throw new Error('ADMIN_PASSWORD must be at least 6 characters');
  }

  await mongoose.connect(process.env.MONGODB_URI);

  let adminUser = await User.findOne({ email: ADMIN_EMAIL });
  const created = !adminUser;

  if (!adminUser) {
    adminUser = new User({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      phone: ADMIN_PHONE,
      college: ADMIN_COLLEGE,
      password: ADMIN_PASSWORD,
      role: 'admin',
      paymentStatus: 'paid'
    });
  } else {
    adminUser.role = 'admin';
    adminUser.name = ADMIN_NAME;
    adminUser.phone = ADMIN_PHONE;
    adminUser.college = ADMIN_COLLEGE;
    adminUser.password = ADMIN_PASSWORD;
  }

  await adminUser.save();

  console.log(created ? 'Admin user created successfully.' : 'Admin user updated successfully.');
  console.log(`Email: ${ADMIN_EMAIL}`);
  console.log(`Password: ${ADMIN_PASSWORD}`);
  console.log('Use these credentials to log in and approve/reject payments in Admin Dashboard.');
};

ensureAdmin()
  .catch((error) => {
    console.error('Failed to ensure admin user:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
