const mongoose = require('mongoose');
const Event = require('./models/Event');
const User = require('./models/User');

require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Event.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@techfest2026.com',
      phone: '9876543210',
      college: 'TechFest Admin',
      password: 'admin123',
      role: 'admin',
      paymentStatus: 'paid',
      paymentAmount: 500
    });

    // Create sample users
    const sampleUsers = [];
    for (let i = 1; i <= 10; i++) {
      const user = await User.create({
        name: `User ${i}`,
        email: `user${i}@example.com`,
        phone: `987654321${i}`,
        college: `College ${i}`,
        password: 'user123',
        role: 'user',
        paymentStatus: i <= 7 ? 'paid' : 'pending',
        paymentAmount: i <= 7 ? 500 : 0
      });
      sampleUsers.push(user);
    }

    // Create sample events
    const events = [
      // Sports Events
      {
        name: 'Inter-College Cricket Championship',
        description: 'Exciting cricket tournament with teams from various colleges competing for the championship title.',
        category: 'Sports',
        subCategory: 'Cricket',
        posterImage: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Virat_Kohli_in_PMO_New_Delhi.jpg',
        date: new Date('2026-04-15'),
        time: '09:00',
        venue: 'Main Cricket Ground',
        prizePool: 25000,
        maxParticipants: 80,
        registrationFee: 100,
        rules: [
          'Each team must have 11 players',
          'Matches will be played in T20 format',
          'Standard cricket rules apply',
          'Teams must report 30 minutes before match time'
        ],
        requirements: [
          'Cricket kit and equipment',
          'Team jersey with numbers',
          'Valid college ID proof'
        ],
        coordinator: {
          name: 'Rahul Sharma',
          phone: '9876543210',
          email: 'cricket@techfest2026.com'
        }
      },
      {
        name: 'Football League',
        description: 'Competitive football league with knockout format. Show your skills on the field!',
        category: 'Sports',
        subCategory: 'Football',
        posterImage: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/The_President%2C_Shri_Ram_Nath_Kovind_presenting_the_Major_Dhyan_Chand_Khel_Ratna_Award%2C_2021_to_Shri_Sunil_Chhetri_for_Football%2C_at_Rashtrapati_Bhavan%2C_in_New_Delhi_on_13_November_2021_%28cropped%29.jpg',
        date: new Date('2026-04-16'),
        time: '14:00',
        venue: 'Football Field',
        prizePool: 20000,
        maxParticipants: 88,
        registrationFee: 80,
        rules: [
          '7-a-side format',
          '20 minutes per half',
          'No offside rule',
          'Yellow card = 2 minutes suspension'
        ],
        requirements: [
          'Football boots',
          'Sports kit',
          'Shin guards'
        ],
        coordinator: {
          name: 'Amit Kumar',
          phone: '9876543211',
          email: 'football@techfest2026.com'
        }
      },
      {
        name: 'Volleyball Tournament',
        description: 'Fast-paced volleyball tournament with teams competing for the championship.',
        category: 'Sports',
        subCategory: 'Volleyball',
        posterImage: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Jimmy_george.jpg',
        date: new Date('2026-04-15'),
        time: '16:00',
        venue: 'Volleyball Court',
        prizePool: 15000,
        maxParticipants: 48,
        registrationFee: 60,
        rules: [
          '6 players per team',
          'Best of 3 sets format',
          '25 points per set',
          'Rotation system mandatory'
        ],
        requirements: [
          'Sports attire',
          'Knee pads recommended',
          'Team registration required'
        ],
        coordinator: {
          name: 'Priya Patel',
          phone: '9876543212',
          email: 'volleyball@techfest2026.com'
        }
      },
      {
        name: 'Kabaddi Championship',
        description: 'Traditional kabaddi tournament showcasing strength and strategy.',
        category: 'Sports',
        subCategory: 'Kabaddi',
        posterImage: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Pardeep_Narwal.png',
        date: new Date('2026-04-17'),
        time: '10:00',
        venue: 'Kabaddi Ground',
        prizePool: 18000,
        maxParticipants: 70,
        registrationFee: 70,
        rules: [
          '7 players per team',
          'Standard kabaddi rules',
          '2 points for all-out',
          '1 point for each player touched'
        ],
        requirements: [
          'Sports clothing',
          'Non-slip shoes',
          'Physical fitness certificate'
        ],
        coordinator: {
          name: 'Vikram Singh',
          phone: '9876543213',
          email: 'kabaddi@techfest2026.com'
        }
      },
      {
        name: 'Kho Kho Competition',
        description: 'Traditional Indian game of Kho Kho with modern rules and excitement.',
        category: 'Sports',
        subCategory: 'Kho Kho',
        posterImage: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Pawan_Sherawat_with_Arjuna_Award_%28cropped%29.jpg',
        date: new Date('2026-04-16'),
        time: '11:00',
        venue: 'Sports Complex',
        prizePool: 10000,
        maxParticipants: 40,
        registrationFee: 50,
        rules: [
          '9 players per team',
          'Innings of 9 minutes',
          'No negative scoring',
          'Chaser must touch runner to score'
        ],
        requirements: [
          'Sports shoes',
          'Comfortable clothing',
          'Team coordination'
        ],
        coordinator: {
          name: 'Anjali Gupta',
          phone: '9876543214',
          email: 'khokho@techfest2026.com'
        }
      },

      // Games Events
      {
        name: 'Chess Championship',
        description: 'Strategic chess tournament for players of all skill levels.',
        category: 'Games',
        subCategory: 'Chess',
        posterImage: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Viswanathan_Anand_%282016%29_%28cropped%29.jpeg',
        date: new Date('2026-04-15'),
        time: '10:00',
        venue: 'Games Room',
        prizePool: 12000,
        maxParticipants: 32,
        registrationFee: 40,
        rules: [
          'Swiss system format',
          '25 minutes per player',
          'Standard FIDE rules',
          'Touch move rule applies'
        ],
        requirements: [
          'Chess clock knowledge',
          'Basic chess rules understanding',
          'Concentration and patience'
        ],
        coordinator: {
          name: 'Rajesh Kumar',
          phone: '9876543215',
          email: 'chess@techfest2026.com'
        }
      },
      {
        name: 'Table Tennis Tournament',
        description: 'Fast-paced table tennis competition with singles and doubles events.',
        category: 'Games',
        subCategory: 'Table Tennis',
        posterImage: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Achanta_Sarath_Kamal_at_Yamuna_Sports_Complex%2C_in_Delhi_on_October_13%2C_2010.jpg',
        date: new Date('2026-04-16'),
        time: '13:00',
        venue: 'Indoor Sports Hall',
        prizePool: 10000,
        maxParticipants: 24,
        registrationFee: 35,
        rules: [
          'Best of 5 games format',
          '11 points per game',
          '2-point lead required to win',
          'Standard ITTF rules'
        ],
        requirements: [
          'Personal paddle (optional)',
          'Sports shoes',
          'Quick reflexes'
        ],
        coordinator: {
          name: 'Sneha Reddy',
          phone: '9876543216',
          email: 'tabletennis@techfest2026.com'
        }
      },
      {
        name: 'Badminton Championship',
        description: 'Competitive badminton tournament showcasing speed and skill.',
        category: 'Games',
        subCategory: 'Badminton',
        posterImage: 'https://upload.wikimedia.org/wikipedia/commons/7/73/PV_Sindhu_headshot.jpg',
        date: new Date('2026-04-17'),
        time: '09:00',
        venue: 'Badminton Court',
        prizePool: 11000,
        maxParticipants: 28,
        registrationFee: 45,
        rules: [
          'Best of 3 games format',
          '21 points per game',
          '2-point lead required to win',
          'Standard BWF rules'
        ],
        requirements: [
          'Badminton racket',
          'Sports shoes',
          'Shuttlecock provided'
        ],
        coordinator: {
          name: 'Mohammed Ali',
          phone: '9876543217',
          email: 'badminton@techfest2026.com'
        }
      },

      // Athletics Events
      {
        name: '100m Sprint Race',
        description: 'Ultimate test of speed and acceleration on the track.',
        category: 'Athletics',
        subCategory: '100m Race',
        posterImage: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Dutee_Chand.jpg',
        date: new Date('2026-04-15'),
        time: '08:00',
        venue: 'Athletics Track',
        prizePool: 8000,
        maxParticipants: 64,
        registrationFee: 30,
        rules: [
          'Standard 100m track',
          'Electronic timing',
          'False start disqualification',
          'Heats and finals format'
        ],
        requirements: [
          'Running shoes',
          'Sports clothing',
          'Warm-up compulsory'
        ],
        coordinator: {
          name: 'David Lee',
          phone: '9876543218',
          email: 'athletics@techfest2026.com'
        }
      },
      {
        name: '400m Race',
        description: 'Middle-distance race combining speed and endurance.',
        category: 'Athletics',
        subCategory: '400m Race',
        posterImage: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Hima_Das_Salutes_India.jpg',
        date: new Date('2026-04-16'),
        time: '15:00',
        venue: 'Athletics Track',
        prizePool: 9000,
        maxParticipants: 32,
        registrationFee: 35,
        rules: [
          'Standard 400m track',
          'Staggered start for lanes',
          'One false start allowed',
          'Lane discipline mandatory'
        ],
        requirements: [
          'Running spikes',
          'Track experience',
          'Physical fitness'
        ],
        coordinator: {
          name: 'Sarah Johnson',
          phone: '9876543219',
          email: 'track@techfest2026.com'
        }
      },
      {
        name: '4x100m Relay Race',
        description: 'Team event testing coordination and baton exchange skills.',
        category: 'Athletics',
        subCategory: 'Relay Race',
        posterImage: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Mohammad_Anas_2017.jpg',
        date: new Date('2026-04-17'),
        time: '11:00',
        venue: 'Athletics Track',
        prizePool: 15000,
        maxParticipants: 32,
        registrationFee: 120,
        rules: [
          '4 runners per team',
          '20m exchange zone',
          'Dropped baton disqualification',
          'Team uniform required'
        ],
        requirements: [
          'Team of 4 runners',
          'Practice baton exchanges',
          'Coordination training'
        ],
        coordinator: {
          name: 'Michael Brown',
          phone: '9876543220',
          email: 'relay@techfest2026.com'
        }
      },
      {
        name: 'Long Jump Competition',
        description: 'Test your jumping skills and technique in this field event.',
        category: 'Athletics',
        subCategory: 'Long Jump',
        posterImage: 'https://upload.wikimedia.org/wikipedia/commons/d/db/15Anju-Bobby-George1_%28cropped%29.jpg',
        date: new Date('2026-04-15'),
        time: '14:00',
        venue: 'Jumping Pit',
        prizePool: 7000,
        maxParticipants: 24,
        registrationFee: 25,
        rules: [
          '3 jumps per participant',
          'Best jump counts',
          'Foul jump measurement',
          'Standard take-off board'
        ],
        requirements: [
          'Jumping shoes',
          'Warm-up area available',
          'Measuring equipment'
        ],
        coordinator: {
          name: 'Lisa Wang',
          phone: '9876543221',
          email: 'jumps@techfest2026.com'
        }
      },
      {
        name: 'Shot Put Competition',
        description: 'Strength and technique competition in field athletics.',
        category: 'Athletics',
        subCategory: 'Shot Put',
        posterImage: 'https://upload.wikimedia.org/wikipedia/commons/1/11/TAJINDER_PAL_SINGH_TOOR_Won_Silver_For_India_In_Shotput.jpg',
        date: new Date('2026-04-16'),
        time: '16:00',
        venue: 'Throwing Field',
        prizePool: 7500,
        maxParticipants: 20,
        registrationFee: 30,
        rules: [
          '3 throws per participant',
          '7.26kg shot for men',
          '4kg shot for women',
          'Foul throw detection'
        ],
        requirements: [
          'Sports clothing',
          'Gloves optional',
          'Strength training'
        ],
        coordinator: {
          name: 'James Wilson',
          phone: '9876543222',
          email: 'throws@techfest2026.com'
        }
      }
    ];

    // Create events
    const createdEvents = await Event.create(events);
    console.log(`✅ Created ${createdEvents.length} events`);

    // Create some sample registrations
    const Registration = require('./models/Registration');
    const sampleRegistrations = [];

    for (let i = 0; i < 20; i++) {
      const randomEvent = createdEvents[Math.floor(Math.random() * createdEvents.length)];
      const randomUser = sampleUsers[Math.floor(Math.random() * sampleUsers.length)];
      
      if (randomUser.paymentStatus === 'paid') {
        const registration = await Registration.create({
          user: randomUser._id,
          event: randomEvent._id,
          amount: randomEvent.registrationFee,
          status: Math.random() > 0.2 ? 'confirmed' : 'registered',
          paymentStatus: 'paid',
          participantDetails: {
            teamName: `Team ${Math.floor(Math.random() * 100)}`,
            teamMembers: [
              {
                name: randomUser.name,
                email: randomUser.email,
                phone: randomUser.phone
              }
            ]
          }
        });
        sampleRegistrations.push(registration);

        // Update event participant count
        await Event.findByIdAndUpdate(randomEvent._id, {
          $inc: { currentParticipants: 1 }
        });
      }
    }

    console.log(`✅ Created ${sampleRegistrations.length} sample registrations`);
    console.log('🎉 Database seeded successfully!');
    console.log('');
    console.log('📋 Login Credentials:');
    console.log('Admin Email: admin@techfest2026.com');
    console.log('Admin Password: admin123');
    console.log('');
    console.log('Sample Users:');
    console.log('Email: user1@example.com, Password: user123');
    console.log('Email: user2@example.com, Password: user123');
    console.log('...and so on up to user10@example.com');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run the seed function
seedData();

