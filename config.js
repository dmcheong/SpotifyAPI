// config.js

const config = {
    development: {
      databaseUrl: 'mongodb://localhost:27017/dev_database',
      api_key: 'dev_api_key',
    },
    production: {
      databaseUrl: process.env.MONGO_DB_URL,
      api_key: process.env.API_KEY,
    },
  };
  
  module.exports = config;
  