const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college-fest', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log('📍 Database:', conn.connection.name);
    console.log('🌐 Host:', conn.connection.host);
    
    // Test creating a sample document
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      college: 'Test College',
      role: 'user',
      paymentStatus: 'pending'
    };
    
    const User = require('./backend/models/User');
    await User.create(testUser);
    console.log('✅ Sample user created in database');
    
    // Show all users
    const users = await User.find({});
    console.log('👥 Total users in database:', users.length);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('\n🔧 Solutions:');
    console.log('1. Make sure MongoDB is installed: https://www.mongodb.com/try/download/community');
    console.log('2. Start MongoDB service: mongod');
    console.log('3. Use MongoDB Atlas: https://www.mongodb.com/cloud/atlas');
    console.log('4. Check .env file MONGODB_URI');
    process.exit(1);
  }
};

connectDB();
