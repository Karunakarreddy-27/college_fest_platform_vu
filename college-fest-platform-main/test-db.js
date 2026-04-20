// Simple MongoDB connection test
console.log('🔍 Testing MongoDB connection...');

// Try to connect to MongoDB
const MongoClient = require('mongodb').MongoClient;

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log('✅ Successfully connected to MongoDB!');
    console.log('📍 Database: college-fest');
    
    const database = client.db('college-fest');
    const usersCollection = database.collection('users');
    
    // Insert test user
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      college: 'Test College',
      role: 'user',
      paymentStatus: 'pending',
      createdAt: new Date()
    };
    
    const result = await usersCollection.insertOne(testUser);
    console.log('✅ Test user inserted with ID:', result.insertedId);
    
    // Count users
    const count = await usersCollection.countDocuments();
    console.log('👥 Total users in database:', count);
    
    console.log('\n🎉 Your MongoDB is working!');
    console.log('📱 Now you can:');
    console.log('1. Start your backend server: npm run server');
    console.log('2. Register users through the web app');
    console.log('3. View registered users in admin dashboard');
    
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    console.log('\n🔧 Solutions:');
    console.log('1. Install MongoDB: https://www.mongodb.com/try/download/community');
    console.log('2. Start MongoDB service: mongod');
    console.log('3. Check if MongoDB is running on port 27017');
    console.log('4. Try MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas');
  } finally {
    await client.close();
  }
}

run().catch(console.error);
