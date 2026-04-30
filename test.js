const { Sequelize } = require('sequelize');
const config = require('./config/config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

console.log('Testing connection with config...');
console.log('Host:', dbConfig.host);
console.log('Port:', dbConfig.port);
console.log('Database:', dbConfig.database);
console.log('SSL:', dbConfig.dialectOptions.ssl);

const sequelize = new Sequelize(dbConfig);

async function test() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection successful!');
    await sequelize.close();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

test();