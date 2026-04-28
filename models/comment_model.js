module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    media_id: {
        type: DataTypes.UUID,
        references: {
            model: "media",
            key: "id",
        },
    },
    guest_name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Guest',
      validate: {
        len: [1, 100]
      }
    },
    // parent_id: {
    //   type: DataTypes.UUID,
    //   allowNull: true,
    //   references: {
    //       model: "comments",
    //       key: "id",
    //   },
    // },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 2000]
      }
    },
    is_approved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, // Auto-approve for wedding
    },
    is_edited: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM('visible', 'hidden', 'deleted'),
      allowNull: false,
      defaultValue: 'visible',
    },
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'comments',
    indexes: [
      { fields: ['media_id'] },
      { fields: ['is_approved'] },
      { fields: ['status'] },
      { fields: ['created_at'] } // For sorting
    ],
  });
  
  Comment.associate = (models) => {
    // Comment.belongsTo(models.User, { 
    //   foreignKey: 'user_id', 
    //   as: 'author',
    //   onDelete: 'CASCADE'
    // });
    Comment.belongsTo(models.Media, { 
      foreignKey: 'media_id', 
      as: 'media',
      onDelete: 'CASCADE'
    });
    // Comment.belongsTo(models.Comment, { 
    //   foreignKey: 'parent_id', 
    //   as: 'parent',
    //   onDelete: 'CASCADE'
    // });
    // Comment.hasMany(models.Comment, { 
    //   foreignKey: 'parent_id', 
    //   as: 'replies',
    //   onDelete: 'CASCADE'
    // });
  };

  return Comment;
};