const multer = require('multer');

// const upload = multer({
//     dest: 'uploads/' // temporary local storage
// });

const upload = multer({
  storage: multer.memoryStorage()
});

module.exports = upload;