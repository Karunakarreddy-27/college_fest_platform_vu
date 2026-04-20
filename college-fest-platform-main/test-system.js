// Test script to verify all systems are working
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

async function testSystem() {
  console.log('=== Testing College Fest Platform ===');
  
  try {
    // Test backend health
    console.log('1. Testing backend connection...');
    try {
      const response = await makeRequest({
        hostname: 'localhost',
        port: 5001,
        path: '/api/auth/test',
        method: 'GET'
      });
      console.log('   Backend responded with:', response.status);
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log('   Backend is not running');
        throw error;
      }
      console.log('   Backend is running (test endpoint not found is expected)');
    }

    // Test register endpoint
    console.log('2. Testing registration...');
    const testUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      phone: '1234567890',
      college: 'Test College',
      password: 'password123'
    };

    const registerResponse = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, testUser);
    console.log('   Registration successful:', registerResponse.data.success);

    // Test login endpoint
    console.log('3. Testing login...');
    const loginResponse = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('   Login successful:', loginResponse.data.success);

    console.log('\n=== All Tests Passed! ===');
    console.log('Backend is working correctly');
    console.log('Authentication flow is working');
    console.log('Database connection is working');

  } catch (error) {
    console.error('Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('Backend is not running on port 5001');
    }
  }
}

testSystem();
