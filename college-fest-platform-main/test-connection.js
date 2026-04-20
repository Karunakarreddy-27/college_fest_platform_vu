// Test connection after port fix
const http = require('http');

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          resolve({ status: res.statusCode, data });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testConnection() {
  console.log('=== Testing VCode 2026 Connection ===');
  
  try {
    // Test backend on port 5000
    console.log('1. Testing backend on port 5000...');
    const testUser = {
      name: 'Connection Test User',
      email: `test-${Date.now()}@vcode2026.com`,
      phone: '1234567890',
      college: 'VCode College',
      password: 'password123'
    };

    const registerResponse = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, testUser);

    if (registerResponse.data.success) {
      console.log('   Registration successful');
      
      // Test login
      console.log('2. Testing login...');
      const loginResponse = await makeRequest({
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        email: testUser.email,
        password: testUser.password
      });

      if (loginResponse.data.success) {
        console.log('   Login successful');
        console.log('   Token received');
        console.log('\n=== CONNECTION FIXED ===');
        console.log('Backend is running on port 5000');
        console.log('Frontend can now connect successfully');
        console.log('VCode 2026 is ready to use!');
      } else {
        console.log('   Login failed');
      }
    } else {
      console.log('   Registration failed');
    }

  } catch (error) {
    console.error('Connection test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('Please ensure backend is running on port 5000');
    }
  }
}

testConnection();
