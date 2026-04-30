require('dotenv').config();
const { Client } = require('pg');

// Parse your connection string to see what's happening
const connectionString = process.env.DATABASE_URL;
console.log('Connection string (hidden password):', 
  connectionString.replace(/npg_[^@]+@/, '****@'));

const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false,  // Required for Neon
  },
  connectionTimeoutMillis: 30000, // 30 second timeout
});

async function test() {
  console.log('Attempting to connect...');
  try {
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const res = await client.query('SELECT version() as version, now() as time');
    console.log('PostgreSQL version:', res.rows[0].version);
    console.log('Server time:', res.rows[0].time);
    
    await client.end();
    console.log('Connection closed properly');
  } catch (err) {
    console.error('❌ Connection failed:');
    console.error('Message:', err.message);
    if (err.code) console.error('Code:', err.code);
    if (err.detail) console.error('Detail:', err.detail);
    if (err.hint) console.error('Hint:', err.hint);
  }
}

test();