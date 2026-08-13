const http = require('http');

const data = JSON.stringify({
  name: "Internal Tester",
  email: "internal@test.com",
  password: "password123",
  phone: "08000"
});

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  console.log(`STATUS: ${res.statusCode}`);
  let responseData = '';
  res.on('data', chunk => responseData += chunk);
  res.on('end', () => console.log('RESPONSE:', responseData));
});

req.on('error', error => console.error('CLIENT ERROR:', error));
req.write(data);
req.end();
