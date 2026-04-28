// seeders/news_seed.js
const db = require('../models/index');
const { v4: uuidv4 } = require('uuid');

module.exports = async () => {
    console.log("Syncing Comments table...");
    await db.Comment.sync({ force: true });
    console.log("Seeding Comments...");

    const media = await db.Media.findOne({ where: {} });

    await db.Comment.create(
        {
            media_id: media.id,
            guest_name: 'Test',
            content: `This is test comment on media '${media.id}'.`,
        },
    );

    console.log("Comment Media Seeded Successfully.");
};