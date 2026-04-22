const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { seedDefaultEvents } = require('../utils/seedDefaultEvents');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const runSeed = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing.');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const result = await seedDefaultEvents();
  console.log(`Inserted ${result.inserted} new default event(s). Active events in DB: ${result.totalActive}.`);
};

runSeed()
  .catch((error) => {
    console.error('Failed to seed default events:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
