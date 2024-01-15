const redis = require('redis');

const client = redis.createClient({
  host: 'localhost',
  port: 6379,
});

client.on('connect', () => {
  console.log('Connected to Redis server');
});

client.on('error', (err) => {
  console.error('Error connecting to Redis:', err);
});

module.exports = client;
