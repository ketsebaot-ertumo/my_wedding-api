module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // userId: {
    //   type: DataTypes.UUID,
    //   allowNull: false,
    //   references: {
    //     model: 'Users',
    //     key: 'id',
    //   }
    // },
    media_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'media',
        key: 'id',
      }
    },
    guest_id: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Device ID of the uploader'
    },
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'likes',
    indexes: [
      {
        unique: true,
        fields: ['media_id', 'guest_id'] // Unique per guest per media
      },
      { fields: ['guest_id'] },
      { fields: ['media_id'] }

    ]
  });
  
  Like.associate = (models) => {
      Like.belongsTo(models.Media, { foreignKey: "media_id", as: "media" });
  };

  return Like;
};