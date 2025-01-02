const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret:process.env.API_SECRET
});


const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Skill connect',
        allowedFormats: ['jpeg', 'png', 'jpg', 'gif', 'mp4','mkv'],

        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    }
});

module.exports = storage ; 