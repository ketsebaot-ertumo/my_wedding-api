
const ALLOWED_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/jpg', 'image/webp',
  'video/mp4', 'video/mpeg', 'video/webm', 'video/ogg'
];

// Helper function to get type from MIME type
const getTypeFromMimeType = (mimeType) => {
  if (!mimeType) return null;
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  return null;
};

module.exports = (sequelize, DataTypes) => {
  const Media = sequelize.define('Media', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('image', 'video'),
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'Size in bytes'
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isValidMimeType(value) {
            if (value) {
                // Basic MIME type format validation
                const mimeRegex = /^[a-z]+\/[a-z0-9\-+\.]+$/i;
                if (!mimeRegex.test(value)) {
                    throw new Error(`Invalid MIME type format: ${value}`);
                }

                // Check against allowed MIME types
                if (!ALLOWED_MIME_TYPES.includes(value.toLowerCase())) {
                    throw new Error(`MIME type must be one of: ${ALLOWED_MIME_TYPES.join(', ')}`);
                }
            }
        }
      },
    },
    caption: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    guest_id: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Guest ID of the uploader'
    },
    // likesCount: {
    //   type: DataTypes.INTEGER,
    //   defaultValue: 0,
    // },
    // commentsCount: {
    //   type: DataTypes.INTEGER,
    //   defaultValue: 0,
    // },
    downloadCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    shareCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
    uploadedBy: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Guest'
    },
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'media',
    hooks: {
      beforeValidate: (media, options) => {
        // Auto-derive 'type' from mimeType if not provided
        if (media.mimeType && !media.type) {
          const derivedType = getTypeFromMimeType(media.mimeType);
          if (derivedType) {
            media.type = derivedType;
          }
        }
        
        // Ensure type and mimeType are consistent if both are provided
        if (media.mimeType && media.type) {
          const derivedType = getTypeFromMimeType(media.mimeType);
          if (derivedType && derivedType !== media.type) {
            throw new Error(`MIME type ${media.mimeType} doesn't match type '${media.type}'`);
          }
        }
      }
    }
  });

  // Media model
  Media.associate = (models) => {
    Media.hasMany(models.Like, { as: 'likes', foreignKey: 'media_id' });
    Media.hasMany(models.Comment, { as: 'comments', foreignKey: 'media_id' });
  };

  return Media;
};