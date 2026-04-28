const mediaService = require('../services/media_service');
const { validationResult } = require('express-validator');
const { success, error } = require('../utils/apiResponse');

class MediaController {
  // Get all media with pagination, filtering, searching
  async getAllMedia(req, res) {
    try {
      // const { page, limit, type, search } = req.query;
       const result = await mediaService.getAllMedia(req.query);
       return success(res, 'Media fetched successfully', result);
    } catch (err) {
      console.log('Error in getAllMedia:', err);
      return error(res, 'Failed to fetch media', err.message);
    }
  }

  // Get media by ID
  async getMediaById(req, res) {
    try {
      const { id } = req.params;
      const media = await mediaService.getMediaById(id);
      return success(res, 'Media fetched successfully', media);
    } catch (err) {
      if (err.message === 'Media not found') {
        return error(res, 'Media not found', err.message, 404);
      }
      console.log('Error in getMediaById:', err);
      return error(res, 'Failed to fetch media', err.message);
    }
  }

  // Create new media
  async createMedia(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const media = await mediaService.createMedia(req.body);
      // res.status(201).json(media);
      return success(res, 'Media created successfully', media, 201);
    } catch (err) {
      console.error('Error in createMedia:', err);
      return error(res, 'Failed to create media', err.message);
    }
  }

  // Update media
  async updateMedia(req, res) {
    try {
      const { id } = req.params;
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const media = await mediaService.updateMedia(id, req.body);
      // res.json(media);
      return success(res, 'Media updated successfully', media);
    } catch (err) {
      if (err.message === 'Media not found or unauthorized') {
        return error(res, 'Media not found or unauthorized', err.message, 404);
      }
      console.error('Error in updateMedia:', err);
      return error(res, 'Failed to update media', err.message);
    }
  }

  // Delete media
  async deleteMedia(req, res) {
    try {
      const { id } = req.params;
      
      const result = await mediaService.deleteMedia(id);
      // res.json(result);
      return success(res, 'Media deleted successfully', result);
    } catch (err) {
      if (err.message === 'Media not found or unauthorized') {
        return error(res, 'Media not found or unauthorized', err.message, 404);
      }
      console.error('Error in deleteMedia:', err);
      return error(res, 'Failed to delete media', err.message);
    }
  }

  // Toggle like/unlike
  async toggleLike(req, res) {
    try {
      const result = await mediaService.toggleLike(req.body, req.params);
      // res.json(result);
      console.log('cont result', result.liked);

      if(result.liked){
        return success(res, 'Media liked successfully', result);
      } else {
        return success(res, 'Media unliked successfully', result);
      }
      // return success(res, 'Like status toggled successfully', result);
    } catch (err) {
      console.error('Error in toggleLike:', err);
      return error(res, 'Failed to toggle like status', err.message);
    }
  }

  // Add comment to media
  async addComment(req, res) {
    try {
      const comment = await mediaService.addComment(req.params.id, req.body);
      // res.status(201).json(comment);
      return success(res, 'Comment added successfully', comment, 201);
    } catch (err) {
      console.error('Error in addComment:', err);
      return error(res, 'Failed to add comment', err.message);
    }
  }

  // Download media
  async downloadMediaCount(req, res) {
    try {
      const result = await mediaService.incrementDownload(req.params.id,);
      return success(res, 'Download count incremented successfully', result, 200);
    } catch (err) {
      console.error('Error in downloadMedia:', err);
      return error(res, 'Failed to increment download count', err.message);
    }
  }

  async shareMediaCount(req, res) {
    try {
      const result = await mediaService.incrementShare(req.params.id,);
      return success(res, 'Share count incremented successfully', result, 200);
    } catch (err) {
      console.error('Error in share media:', err);
      return error(res, 'Failed to increment share count', err.message);
    }
  }

  // Get media statistics
  async getStats(req, res) {
    try {
      const stats = await mediaService.getMediaStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new MediaController();