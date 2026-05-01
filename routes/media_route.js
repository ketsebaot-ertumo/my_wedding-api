const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/media_controller');
const upload = require('../middleware/upload');

// Use memory (NOT disk) for Vercel
// const upload = multer({ storage: multer.memoryStorage() });

// Specific routes first
router.get('/stats', mediaController.getStats);

// Media CRUD routes
router.get('/', mediaController.getAllMedia);
router.get('/:id', mediaController.getMediaById);
// router.post('/', mediaController.createMedia);
// router.post('/', upload.single('file'), mediaController.createMedia);
router.post('/', upload.array('files'), mediaController.createMedia);
router.put('/:id', mediaController.updateMedia);
router.delete('/:id', mediaController.deleteMedia);

// Likes and comments
router.post('/:id/like', mediaController.toggleLike);
router.post('/:id/comment', mediaController.addComment);

// Downloads and shares counts
router.put('/:id/download', mediaController.downloadMediaCount);
router.put('/:id/share', mediaController.shareMediaCount);

module.exports = router;
