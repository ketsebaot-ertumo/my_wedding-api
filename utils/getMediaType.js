// utils/getMediaType.js - CommonJS version

function getTypeFromMimeType(mimeType) {
  if (!mimeType) return null;
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  return null;
}

function isValidMediaType(mimeType) {
  const type = getTypeFromMimeType(mimeType);
  return type !== null;
}

function getSpecificType(mimeType) {
  const type = getTypeFromMimeType(mimeType);
  if (!type) return null;
  
  // Extract the specific format (e.g., 'jpeg' from 'image/jpeg')
  const specific = mimeType.split('/')[1];
  return { type, specific };
}

module.exports = {
  getTypeFromMimeType,
  isValidMediaType,
  getSpecificType
};