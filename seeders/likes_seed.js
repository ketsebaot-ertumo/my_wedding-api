// seeders/news_seed.js
const db = require('../models/index');
const { v4: uuidv4 } = require('uuid');

module.exports = async () => {
    console.log("Syncing Likes table...");
    await db.Like.sync({ force: true });
    console.log("Seeding Likes...");

    const media = await db.Media.findOne({ where: {} });

    await db.Like.create(
        {
            media_id: media.id,
            guest_id: uuidv4(),
        },
    );

    console.log("Like Media Seeded Successfully.");
};