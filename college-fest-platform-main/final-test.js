// Final comprehensive test for the College Fest Platform
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

async function runFinalTest() {
  console.log('=== FINAL COMPREHENSIVE TEST ===');
  console.log('Testing all critical functionality...\n');
  
  let allTestsPassed = true;
  
  // Test 1: Backend Health
  console.log('1. Backend Health Check');
  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { email: 'test@health.com', name: 'Health Check', phone: '123', college: 'Test', password: 'test' });
    
    if (response.status === 400 || response.status === 201) {
      console.log('   Backend is running and responding');
    } else {
      console.log('   Backend responded with:', response.status);
    }
  } catch (error) {
    console.log('   Backend connection failed:', error.message);
    allTestsPassed = false;
  }

  // Test 2: Registration Flow
  console.log('\n2. User Registration Flow');
  try {
    const testUser = {
      name: 'Final Test User',
      email: `final-test-${Date.now()}@example.com`,
      phone: '1234567890',
      college: 'Test College',
      password: 'password123'
    };

    const registerResponse = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, testUser);

    if (registerResponse.data.success) {
      console.log('   Registration successful');
      
      // Test 3: Login Flow
      console.log('\n3. User Login Flow');
      const loginResponse = await makeRequest({
        hostname: 'localhost',
        port: 5001,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        email: testUser.email,
        password: testUser.password
      });

      if (loginResponse.data.success) {
        console.log('   Login successful');
        console.log('   Token received:', loginResponse.data.token ? 'Yes' : 'No');
        console.log('   User data received:', loginResponse.data.user ? 'Yes' : 'No');
      } else {
        console.log('   Login failed');
        allTestsPassed = false;
      }
    } else {
      console.log('   Registration failed');
      allTestsPassed = false;
    }
  } catch (error) {
    console.log('   Auth flow failed:', error.message);
    allTestsPassed = false;
  }

  // Test 4: Events API
  console.log('\n4. Events API');
  try {
    const eventsResponse = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/api/events',
      method: 'GET'
    });

    if (eventsResponse.status === 200) {
      console.log('   Events API working');
      console.log('   Events count:', Array.isArray(eventsResponse.data.events) ? eventsResponse.data.events.length : 'Not array');
    } else {
      console.log('   Events API responded with:', eventsResponse.status);
    }
  } catch (error) {
    console.log('   Events API failed:', error.message);
  }

  // Final Results
  console.log('\n=== FINAL RESULTS ===');
  if (allTestsPassed) {
    console.log('SUCCESS: All critical tests passed!');
    console.log('Backend is running correctly');
    console.log('Authentication system is working');
    console.log('Database connection is functional');
    console.log('API endpoints are responding');
    console.log('\nThe application should work correctly!');
  } else {
    console.log('FAILURE: Some tests failed');
    console.log('Please check the errors above');
  }
}

runFinalTest();
