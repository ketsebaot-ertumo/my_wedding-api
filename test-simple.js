require('dotenv').config();
const driveService = require('./services/googleDrive.service');

async function test() {
  try {
    console.log('Testing connection...');
    await driveService.getDrive();
    console.log('✅ Success! Drive is ready to use.');
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('First-time setup')) {
      console.log('\nPlease run: node setup-drive.js first');
    }
  }
}

test();