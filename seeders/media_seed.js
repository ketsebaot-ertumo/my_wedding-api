// seeders/news_seed.js
const { Media } = require('../models/index');
const { v4: uuidv4 } = require('uuid');

module.exports = async () => {
    console.log("Syncing Media table...");
    await Media.sync({ force: true });
    console.log("Seeding Media...");

    await Media.bulkCreate([
        {
            url: 'https://res.cloudinary.com/dq6mvqivd/image/upload/v1776710252/my_wedding/home/0W6A7334_1_fqcphl.jpg',
            type: 'image',
            filename: 'wedding-ceremony.jpg',
            size: 2456789,
            mimeType: 'image/jpeg',
            uploadedBy: 'Ketsi',
            caption: 'Beautiful ceremony moment ❤️',
            guest_id: uuidv4(),
            // likesCount: 42,
            downloadCount: 5,
            shareCount: 3
        },
        {
            url: 'https://example.com/wedding/first-dance.mp4',
            type: 'video',
            filename: 'first-dance.mp4',
            size: 56789012,
            mimeType: 'video/mp4',
            uploadedBy: 'John',
            caption: 'Their first dance as married couple! 💃🕺',
            guest_id: uuidv4(),
            // likesCount: 89,
            // downloadsCount: 12,
            // sharesCount: 7
        },
        {
            url: 'https://res.cloudinary.com/dq6mvqivd/image/upload/v1776754853/my_wedding/0W6A7467_qcbgrk.jpg',
            type: 'image',
            filename: 'cake-cutting.jpg',
            size: 3123456,
            mimeType: 'image/jpeg',
            uploadedBy: 'Emma',
            caption: 'Sweet moments with the wedding cake 🍰',
            guest_id: uuidv4(),
            // likesCount: 56,
            // downloadsCount: 8,
            // sharesCount: 4
        },
        {
            url: 'https://res.cloudinary.com/dq6mvqivd/image/upload/v1777073069/my_wedding/Apr_25_2026_02_23_02_AM_g6urja.png',
            type: 'image',
            filename: 'family-photo.jpg',
            size: 4123456,
            mimeType: 'image/jpeg',
            uploadedBy: 'David',
            guest_id: uuidv4(),
            // likesCount: 34,
            // downloadsCount: 6,
            // sharesCount: 2
        },
        {
            url: 'https://example.com/wedding/speeches.mp4',
            type: 'video',
            filename: 'speeches.mp4',
            size: 98765432,
            mimeType: 'video/mp4',
            uploadedBy: 'Michael',
            caption: 'Heartwarming speeches from family',
            guest_id: uuidv4(),
            // likesCount: 67,
            // downloadsCount: 15,
            // sharesCount: 9
        },
        {
            url: 'https://example.com/wedding/decorations.jpg',
            type: 'image',
            filename: 'decorations.jpg',
            size: 2345678,
            mimeType: 'image/jpeg',
            uploadedBy: 'Lisa',
            caption: 'Beautiful venue decorations ✨',
             guest_id: uuidv4(),
            // likesCount: 45,
            // downloadsCount: 7,
            // sharesCount: 5
        }
    ]);

    console.log("Media Seeded Successfully.");
};