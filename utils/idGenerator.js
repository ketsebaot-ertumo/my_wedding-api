// utils/idGenerator.js

const generateProjectId = (prefix = "ID") => {
  // return `${prefix}-${Date.now()}`;
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // e.g., 20250709
  const random = Math.random().toString(36).substr(2, 32); // random 8-character alphanumeric string
  return `${prefix}-${random}`;
};

module.exports = { generateProjectId };
  