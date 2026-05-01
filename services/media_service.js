const db = require('../models');
const { Op } = require('sequelize');
const { buildPagination } = require('../utils/pagination');
const throwError = require("../utils/throwError");
const googleDriveService = require('./googleDrive.service');


// Helper function
function getTypeFromMimeType(mimeType) {
  if (!mimeType) return null;
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  return null;
}

class MediaService {
  
  // Create new media
  async createMedia(mediaData) {
    try {
      if(!mediaData.url || !mediaData.mimeType || !mediaData.filename || !mediaData.size || !mediaData.guest_id) {
        throwError('Missing required media fields', 400);
      }

      const type = getTypeFromMimeType(mediaData.mimeType);

      if (type !== 'image' && type !== 'video') {
        throwError('Invalid media type. Must be either image or video.', 400);
      }

      const existingMedia = await db.Media.findOne({where: {type, ...mediaData}});

      if (existingMedia) {
        throwError('Media with the same URL already exists', 409);
      }

      const media = await db.Media.create({type, ...mediaData});

      return media;
    } catch (error) {
      throwError(`Failed to create media: ${error.message}`);
    }
  }


  // // Create new media with Google Drive upload
  // async createMedia(mediaData, file) {
  //   try {
  //     if (!file) {
  //       throw new Error('No file provided');
  //     }
  //     // Upload file to Google Drive first
  //     const driveFile = await googleDriveService.uploadFile(file);
      
  //     // Prepare media data with Drive URL
  //     const mediaPayload = {
  //       url: driveFile.url,                    // URL from Google Drive
  //       type: getTypeFromMimeType(file.mimetype),
  //       filename: driveFile.name,
  //       size: file.size,
  //       guest_id: mediaData.guest_id,
  //       uploadedBy: mediaData.uploadedBy || 'Guest',
  //       mimeType: file.mimetype,
  //       caption: mediaData.caption || null,
  //       metadata: {
  //         driveFileId: driveFile.id,
  //         driveWebViewLink: driveFile.webViewLink,
  //         originalName: file.originalname,
  //         ...mediaData.metadata
  //       }
  //     };

  //     // Validate required fields
  //     if (!mediaPayload.url || !mediaPayload.type || !mediaPayload.filename || 
  //         !mediaPayload.size || !mediaPayload.guest_id || !mediaPayload.uploadedBy) {
  //       throw new Error('Missing required media fields');
  //     }

  //     if (mediaPayload.type !== 'image' && mediaPayload.type !== 'video') {
  //       throw new Error('Invalid media type. Must be either image or video.');
  //     }

  //     // Check for duplicate (optional - you might want to check by filename or Drive file ID)
  //     const existingMedia = await db.Media.findOne({
  //       where: { 
  //         url: mediaPayload.url 
  //       }
  //     });

  //     if (existingMedia) {
  //       throw new Error('Media with the same URL already exists');
  //     }

  //     // Save to database
  //     const media = await db.Media.create(mediaPayload);
  //     return media;

  //   } catch (error) {
  //     throw new Error(`Failed to create media: ${error.message}`);
  //   }
  // }

  
  // Get all media with pagination, filtering, and sorting
  async getAllMedia(query) {
    const { page, limit, offset, order } = buildPagination(query);
    try {
      const where = { isActive: true };
      console.log('query', query);
      
      if (query.type && query.type !== 'all' && (query.type === 'image' || query.type === 'video')) {
        where.type = query.type;
      }
      
      if (query.search) {
        where[Op.or] = [
          { filename: { [Op.iLike]: `%${query.search}%` } },
          { caption: { [Op.iLike]: `%${query.search}%` } }
        ];
      }
      
      // Get count separately (without includes)
      const count = await db.Media.count({ where });
      
      // Get data with includes
      const rows = await db.Media.findAll({
        where,
        attributes: {
          include: [
            [db.sequelize.literal(`(
              SELECT COUNT(*)::int
              FROM likes
              WHERE likes.media_id = "Media"."id"
            )`), 'likeCount'],
            [
              db.sequelize.literal(`(
                SELECT COUNT(*)::int
                FROM comments
                WHERE comments.media_id = "Media"."id"
              )`),
              'commentCount'
            ],
          ],
        },
        include: [
          {
            model: db.Like,
            as: 'likes',
            attributes: ['id', 'guest_id'],
          },
          {
            model: db.Comment,
            as: 'comments',
            attributes: ['id', 'guest_name', 'content', 'is_edited', 'status', 'createdAt'],
          }
        ],
        order,
        limit,
        offset,
      });

      return {
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit),
        limit: parseInt(limit),
        pageSize: parseInt(rows.length), // lenght of current page, not total limit
        hasMore: offset + rows.length < count,
        media: rows,
      };
    } catch (error) {
      throwError(`Failed to fetch media: ${error.message}`);
    }
  }
  // async getAllMedia(query) {
  //   const { page, limit, offset, order } = buildPagination(query);
  //   try {
  //     const where = { isActive: true };
  //     console.log('query', query);
      
  //    if (query.type && query.type !== 'all' && (query.type === 'image' || query.type === 'video')) {
  //       where.type = query.type;
  //     }
      
  //     if (query.search) {
  //       where[Op.or] = [
  //         { filename: { [Op.iLike]: `%${query.search}%` } },
  //         { caption: { [Op.iLike]: `%${query.search}%` } }
  //       ];
  //     }
      
  //     const { count, rows } = await db.Media.findAndCountAll({
  //       where,
  //       attributes: {
  //         include: [
  //           // Like count
  //           [db.sequelize.literal(`(
  //             SELECT COUNT(*)::int
  //             FROM likes
  //             WHERE likes.media_id = "Media"."id"
  //           )`), 'likeCount'],

  //           // Comment count
  //           [
  //             db.sequelize.literal(`(
  //               SELECT COUNT(*)::int
  //               FROM comments
  //               WHERE comments.media_id = "Media"."id"
  //             )`),
  //             'commentCount'
  //           ],
  //         ],
  //       },
  //       include: [
  //         {
  //           model: db.Like,
  //           as: 'likes',
  //           attributes: ['id', 'guest_id'],
  //           duplicating: false,
  //         },
  //         {
  //           model: db.Comment,
  //           as: 'comments',
  //           attributes: ['id', 'guest_name', 'content', 'is_edited', 'status', 'createdAt'],
  //           duplicating: false,
  //         }
  //       ],
  //       order,
  //       limit,
  //       offset,
  //     });

  //     return {
  //       total: count,
  //       page: parseInt(page),
  //       totalPages: Math.ceil(count / limit),
  //       limit: parseInt(rows.length), // or shows limit per page
  //       hasMore: offset + rows.length < count,
  //       media: rows,
  //     };
  //   } catch (error) {
  //     throwError(`Failed to fetch media: ${error.message}`);
  //   }
  // }


  // Get media by ID
  async getMediaById(id) {
    try {
      const media = await db.Media.findOne({
        where: { id, isActive: true },
        include: [
          {
            model: db.Like,
            as: 'likes',
            attributes: ['id', 'guest_id']
          },
          {
            model: db.Comment,
            as: 'comments',
            attributes: ['id', 'guest_name', 'content', 'is_edited', 'status', 'createdAt'],
          }
        ]
      });

      if (!media) {
        throwError('Media not found', 400);
      }

      return media;
    } catch (error) {
      throwError(`Failed to fetch media: ${error.message}`);
    }
  }


  // Update media details
  async updateMedia(id, updateData) {
    const t = await sequelize.transaction();
    try {
      if (!id || Object.keys(updateData).length === 0) {
        throwError('Invalid media ID or empty update data', 400);
      }

      const media = await db.Media.findOne({
        where: { id },
        transaction: t,
      });

      if (!media) {
        throwError('Media not found or unauthorized', 404);
      }

      await media.update(updateData, { transaction: t });

      await t.commit();
      await media.reload();

      // const updatedMedia = await this.getMediaById(id);
      return media;
    } catch (error) {
      await t.rollback();
      throwError(`Failed to update media: ${error.message}`);
    }
  }

  // Delete media
  async deleteMedia(id) {
    const t = await sequelize.transaction();
    try {
      if (!id) {
        throwError('Invalid media ID.', 400);
      }

      const media = await db.Media.findOne({
        where: { id},
        transaction: t,
      });

      if (!media) {
        throwError('Media not found or unauthorized', 404);
      }

      await media.destroy({ transaction });
      await t.commit();
      return { success: true, message: 'Media deleted successfully' };
    } catch (error) {
      await t.rollback();
      throwError(`Failed to delete media: ${error.message}`);
    }
  }

  // Toggle like/unlike
  async toggleLike(likeData, params) {
    const t = await db.sequelize.transaction(); // start transaction
    try {
      if (!params.id || !likeData.guest_id) {
        throwError('Invalid media ID or empty guest ID', 400);
      }

      // Check if like exists within the transaction
      const existingLike = await db.Like.findOne({
        where: {guest_id: likeData.guest_id, media_id: params.id },
        transaction: t
      });
      console.log('existingLike', existingLike);

      let result;
      if (existingLike) {
        await existingLike.destroy({ transaction: t }); // delete within transaction
        result = { liked: false };
      } else {
        await db.Like.create({...likeData, media_id: params.id }, { transaction: t }); // create within transaction
        result = { liked: true };
      }

      await t.commit(); // commit the transaction
      console.log('result', result);
      return result;

    } catch (error) {
      await t.rollback(); // rollback on error
      throwError(`Failed to toggle like: ${error.message}`);
    }
  }

  // Add comment to media]
  async addComment(commentData) {
    const transaction = await db.sequelize.transaction();
    
    try {
      if(!commentData.media_id || !commentData.guest_name || !commentData.content) {
        throwError('Missing required fields: media_id, guest_name and content are required.', 400);
      }

      const comment = await db.Comment.create(commentData, { transaction });

      await transaction.commit();
      return comment;

    } catch (error) {
      await transaction.rollback();
      throwError(`Failed to add comment: ${error.message}`);
    }
  }

  // Increment download count
  async incrementDownload(id) {
    const t = await sequelize.transaction();
    try {
      if (!id) {
        throwError('Invalid media ID or empty data', 400);
      }

      await db.Media.increment('downloadsCount', {
        by: 1,
        where: { id },
        transaction: t
      });

      await t.commit();
      return { success: true };
    } catch (error) {
      await t.rollback();
      console.error('Error incrementing download count:', error);
      throwError(`Failed to update download count: ${error.message}`);
    }
  }

  // Increment share count
  async incrementShare(id) {
    const t = await sequelize.transaction();
    try {
      if (!id) {
        throwError('Invalid media ID or empty data', 400);
      }

      await db.Media.increment('sharesCount', {
        by: 1,
        where: { id },
        transaction: t
      });

      await t.commit();
      return { success: true };
    } catch (error) {
      await t.rollback();
      console.error('Error incrementing share count:', error);
      throwError(`Failed to update share count: ${error.message}`);
    }
  }

  // Get media statistics
  async getMediaStats() {
    try {
      // Media counts
      const totalMedia = await db.Media.count({ where: { isActive: true } });
      const totalImages = await db.Media.count({ where: { isActive: true, type: 'image' } });
      const totalVideos = await db.Media.count({ where: { isActive: true, type: 'video' } });

      // Downloads & Shares sums
      const totalDownloads = await db.Media.sum('download_count', { where: { isActive: true } });
      const totalShares = await db.Media.sum('share_count', { where: { isActive: true } });

      // Likes & Comments counts
      const totalLikes = await db.Like.count({
        include: [
          {
            model: db.Media,
            as: 'media',
            where: { isActive: true }
          }
        ]
      });

      const totalComments = await db.Comment.count({
        include: [
          {
            model: db.Media,
            as: 'media',
            where: { isActive: true }
          }
        ]
      });

      return {
        success: true,
        data: {
          totalMedia,
          totalImages,
          totalVideos,
          totalLikes,
          totalComments,
          totalDownloads,
          totalShares
        }
      };
    } catch (error) {
      console.error('Error fetching media stats:', error);
      throw new Error(`Failed to get stats: ${error.message}`);
    }
  }


  // // Get media statistics
  // async getMediaStats() {
  //   try {
  //     const stats = await db.Media.findAll({
  //       where: { isActive: true },
  //       attributes: [
  //         // Media counts
  //         [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'totalMedia'],
  //         [db.sequelize.fn('SUM', db.sequelize.literal("CASE WHEN type = 'image' THEN 1 ELSE 0 END")), 'totalImages'],
  //         [db.sequelize.fn('SUM', db.sequelize.literal("CASE WHEN type = 'video' THEN 1 ELSE 0 END")), 'totalVideos'],
          
  //         // Download & Share sums
  //         [db.sequelize.fn('SUM', db.sequelize.col('Media.download_count')), 'totalDownloads'],
  //         [db.sequelize.fn('SUM', db.sequelize.col('Media.share_count')), 'totalShares'],
  //       ],
  //       include: [
  //         {
  //           model: db.Like,
  //           as: 'likes',
  //           attributes: [[db.sequelize.fn('COUNT', db.sequelize.col('likes.id')), 'totalLikes']]
  //         },
  //         {
  //           model: db.Comment,
  //           as: 'comments',
  //           attributes: [[db.sequelize.fn('COUNT', db.sequelize.col('comments.id')), 'totalComments']]
  //         }
  //      ],
  //       raw: true
  //     });

  //     return {
  //       totalMedia: parseInt(stats[0]?.totalMedia) || 0,
  //       totalImages: parseInt(stats[0]?.totalImages) || 0,
  //       totalVideos: parseInt(stats[0]?.totalVideos) || 0,
  //       totalLikes: parseInt(stats[0]?.totalLikes) || 0,
  //       totalComments: parseInt(stats[0]?.totalComments) || 0,
  //       totalDownloads: parseInt(stats[0]?.totalDownloads) || 0,
  //       totalShares: parseInt(stats[0]?.totalShares) || 0
  //     };
  //   } catch (error) {
  //     console.error('Error fetching media stats:', error);
  //     throwError(`Failed to get stats: ${error.message}`);
  //   }
  // }
}

module.exports = new MediaService();