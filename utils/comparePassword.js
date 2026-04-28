const bcryptjs = require('bcryptjs');

async function comparePassword(plainPassword, hashedPassword) {
  try {
    return await bcryptjs.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw error;
  }
}

module.exports = comparePassword;
