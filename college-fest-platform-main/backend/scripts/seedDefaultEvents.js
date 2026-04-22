const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('../models/Event');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const defaultEvents = [
  {
    name: 'Inter-College Cricket Championship',
    description: 'T20 cricket tournament for college teams.',
    category: 'Sports',
    subCategory: 'Cricket',
    posterImage: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Virat_Kohli_in_PMO_New_Delhi.jpg',
    date: new Date('2026-05-15'),
    time: '09:00',
    venue: 'Main Cricket Ground',
    prizePool: 25000,
    maxParticipants: 80,
    registrationFee: 100,
    rules: [
      'Each team must have 11 players.',
      'Matches are in T20 format.'
    ],
    requirements: [
      'Team jersey',
      'Valid college ID'
    ],
    coordinator: {
      name: 'Rahul Sharma',
      phone: '9876543210',
      email: 'cricket@techfest2026.com'
    },
    status: 'upcoming',
    isActive: true
  },
  {
    name: 'Chess Championship',
    description: 'Strategic chess event for all skill levels.',
    category: 'Games',
    subCategory: 'Chess',
    posterImage: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Viswanathan_Anand_%282016%29_%28cropped%29.jpeg',
    date: new Date('2026-05-16'),
    time: '10:00',
    venue: 'Games Hall',
    prizePool: 12000,
    maxParticipants: 32,
    registrationFee: 40,
    rules: [
      'Swiss pairing format.',
      'Standard FIDE rules apply.'
    ],
    requirements: [
      'Valid college ID',
      'Report 30 minutes before start'
    ],
    coordinator: {
      name: 'Rajesh Kumar',
      phone: '9876543215',
      email: 'chess@techfest2026.com'
    },
    status: 'upcoming',
    isActive: true
  },
  {
    name: '100m Sprint Race',
    description: 'Track event to test explosive speed.',
    category: 'Athletics',
    subCategory: '100m Race',
    posterImage: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Dutee_Chand.jpg',
    date: new Date('2026-05-17'),
    time: '08:00',
    venue: 'Athletics Track',
    prizePool: 8000,
    maxParticipants: 64,
    registrationFee: 30,
    rules: [
      'Standard track rules apply.',
      'False start can lead to disqualification.'
    ],
    requirements: [
      'Running shoes',
      'Valid college ID'
    ],
    coordinator: {
      name: 'David Lee',
      phone: '9876543218',
      email: 'athletics@techfest2026.com'
    },
    status: 'upcoming',
    isActive: true
  }
];

const seedDefaultEvents = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing.');
  }

  await mongoose.connect(process.env.MONGODB_URI);

  let inserted = 0;

  for (const event of defaultEvents) {
    const result = await Event.updateOne(
      { name: event.name },
      { $setOnInsert: event },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      inserted += 1;
    }
  }

  const totalEvents = await Event.countDocuments({ isActive: true });
  console.log(`Inserted ${inserted} new default event(s). Active events in DB: ${totalEvents}.`);
};

seedDefaultEvents()
  .catch((error) => {
    console.error('Failed to seed default events:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
