// Simple health check for Docker
const http = require('http');

const options = {
  host: 'localhost',
  port: 3001,
  timeout: 2000,
  path: '/health'
};

const request = http.request(options, (res) => {
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', () => {
  process.exit(1);
});

request.end();
