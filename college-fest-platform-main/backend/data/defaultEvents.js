const buildDefaultEvents = () => ([
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
    name: 'Football League',
    description: 'Competitive football league in knockout format.',
    category: 'Sports',
    subCategory: 'Football',
    posterImage: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/The_President%2C_Shri_Ram_Nath_Kovind_presenting_the_Major_Dhyan_Chand_Khel_Ratna_Award%2C_2021_to_Shri_Sunil_Chhetri_for_Football%2C_at_Rashtrapati_Bhavan%2C_in_New_Delhi_on_13_November_2021_%28cropped%29.jpg',
    date: new Date('2026-05-16'),
    time: '14:00',
    venue: 'Football Field',
    prizePool: 20000,
    maxParticipants: 88,
    registrationFee: 80,
    rules: [
      '7-a-side format.',
      'No offside rule.'
    ],
    requirements: [
      'Football boots',
      'College ID card'
    ],
    coordinator: {
      name: 'Amit Kumar',
      phone: '9876543211',
      email: 'football@techfest2026.com'
    },
    status: 'upcoming',
    isActive: true
  },
  {
    name: 'Volleyball Tournament',
    description: 'Fast-paced volleyball tournament with team events.',
    category: 'Sports',
    subCategory: 'Volleyball',
    posterImage: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Jimmy_george.jpg',
    date: new Date('2026-05-17'),
    time: '16:00',
    venue: 'Volleyball Court',
    prizePool: 15000,
    maxParticipants: 48,
    registrationFee: 60,
    rules: [
      '6 players per team.',
      'Best of 3 sets.'
    ],
    requirements: [
      'Sports attire',
      'Team registration'
    ],
    coordinator: {
      name: 'Priya Patel',
      phone: '9876543212',
      email: 'volleyball@techfest2026.com'
    },
    status: 'upcoming',
    isActive: true
  },
  {
    name: 'Kabaddi Championship',
    description: 'Traditional kabaddi competition with standard rules.',
    category: 'Sports',
    subCategory: 'Kabaddi',
    posterImage: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Pardeep_Narwal.png',
    date: new Date('2026-05-18'),
    time: '10:00',
    venue: 'Kabaddi Ground',
    prizePool: 18000,
    maxParticipants: 70,
    registrationFee: 70,
    rules: [
      '7 players per team.',
      'Standard scoring applies.'
    ],
    requirements: [
      'Sports clothing',
      'Fitness certificate'
    ],
    coordinator: {
      name: 'Vikram Singh',
      phone: '9876543213',
      email: 'kabaddi@techfest2026.com'
    },
    status: 'upcoming',
    isActive: true
  },
  {
    name: 'Kho Kho Competition',
    description: 'Kho Kho event focused on speed and teamwork.',
    category: 'Sports',
    subCategory: 'Kho Kho',
    posterImage: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Pawan_Sherawat_with_Arjuna_Award_%28cropped%29.jpg',
    date: new Date('2026-05-19'),
    time: '11:00',
    venue: 'Sports Complex',
    prizePool: 10000,
    maxParticipants: 40,
    registrationFee: 50,
    rules: [
      '9 players per team.',
      'Two innings of 9 minutes.'
    ],
    requirements: [
      'Sports shoes',
      'Team lineup'
    ],
    coordinator: {
      name: 'Anjali Gupta',
      phone: '9876543214',
      email: 'khokho@techfest2026.com'
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
    name: 'Table Tennis Tournament',
    description: 'Table tennis tournament for singles competition.',
    category: 'Games',
    subCategory: 'Table Tennis',
    posterImage: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Achanta_Sarath_Kamal_at_Yamuna_Sports_Complex%2C_in_Delhi_on_October_13%2C_2010.jpg',
    date: new Date('2026-05-20'),
    time: '13:00',
    venue: 'Indoor Sports Hall',
    prizePool: 10000,
    maxParticipants: 24,
    registrationFee: 35,
    rules: [
      'Best of 5 games.',
      '11 points per game.'
    ],
    requirements: [
      'Sports shoes',
      'College ID card'
    ],
    coordinator: {
      name: 'Sneha Reddy',
      phone: '9876543216',
      email: 'tabletennis@techfest2026.com'
    },
    status: 'upcoming',
    isActive: true
  },
  {
    name: 'Badminton Championship',
    description: 'Badminton event for speed and precision.',
    category: 'Games',
    subCategory: 'Badminton',
    posterImage: 'https://upload.wikimedia.org/wikipedia/commons/7/73/PV_Sindhu_headshot.jpg',
    date: new Date('2026-05-21'),
    time: '09:00',
    venue: 'Badminton Court',
    prizePool: 11000,
    maxParticipants: 28,
    registrationFee: 45,
    rules: [
      'Best of 3 games.',
      '21-point format.'
    ],
    requirements: [
      'Racket',
      'Sports shoes'
    ],
    coordinator: {
      name: 'Mohammed Ali',
      phone: '9876543217',
      email: 'badminton@techfest2026.com'
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
  },
  {
    name: '400m Race',
    description: 'Middle-distance race combining speed and endurance.',
    category: 'Athletics',
    subCategory: '400m Race',
    posterImage: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Hima_Das_Salutes_India.jpg',
    date: new Date('2026-05-18'),
    time: '15:00',
    venue: 'Athletics Track',
    prizePool: 9000,
    maxParticipants: 32,
    registrationFee: 35,
    rules: [
      'Staggered lane start.',
      'Lane discipline mandatory.'
    ],
    requirements: [
      'Running spikes',
      'College ID card'
    ],
    coordinator: {
      name: 'Sarah Johnson',
      phone: '9876543219',
      email: 'track@techfest2026.com'
    },
    status: 'upcoming',
    isActive: true
  },
  {
    name: '4x100m Relay Race',
    description: 'Team sprint event with baton exchanges.',
    category: 'Athletics',
    subCategory: 'Relay Race',
    posterImage: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Mohammad_Anas_2017.jpg',
    date: new Date('2026-05-19'),
    time: '11:00',
    venue: 'Athletics Track',
    prizePool: 15000,
    maxParticipants: 32,
    registrationFee: 120,
    rules: [
      '4 runners per team.',
      'Dropped baton leads to disqualification.'
    ],
    requirements: [
      'Team of 4 runners',
      'Practice exchanges'
    ],
    coordinator: {
      name: 'Michael Brown',
      phone: '9876543220',
      email: 'relay@techfest2026.com'
    },
    status: 'upcoming',
    isActive: true
  },
  {
    name: 'Long Jump Competition',
    description: 'Field event to test jump distance and technique.',
    category: 'Athletics',
    subCategory: 'Long Jump',
    posterImage: 'https://upload.wikimedia.org/wikipedia/commons/d/db/15Anju-Bobby-George1_%28cropped%29.jpg',
    date: new Date('2026-05-20'),
    time: '14:00',
    venue: 'Jumping Pit',
    prizePool: 7000,
    maxParticipants: 24,
    registrationFee: 25,
    rules: [
      '3 attempts per participant.',
      'Best jump counts.'
    ],
    requirements: [
      'Jumping shoes',
      'Warm-up required'
    ],
    coordinator: {
      name: 'Lisa Wang',
      phone: '9876543221',
      email: 'jumps@techfest2026.com'
    },
    status: 'upcoming',
    isActive: true
  },
  {
    name: 'Shot Put Competition',
    description: 'Strength and technique event in athletics.',
    category: 'Athletics',
    subCategory: 'Shot Put',
    posterImage: 'https://upload.wikimedia.org/wikipedia/commons/1/11/TAJINDER_PAL_SINGH_TOOR_Won_Silver_For_India_In_Shotput.jpg',
    date: new Date('2026-05-21'),
    time: '16:00',
    venue: 'Throwing Field',
    prizePool: 7500,
    maxParticipants: 20,
    registrationFee: 30,
    rules: [
      '3 throws per participant.',
      'Foul throws are disallowed.'
    ],
    requirements: [
      'Sports clothing',
      'College ID card'
    ],
    coordinator: {
      name: 'James Wilson',
      phone: '9876543222',
      email: 'throws@techfest2026.com'
    },
    status: 'upcoming',
    isActive: true
  }
]);

module.exports = {
  buildDefaultEvents
};
