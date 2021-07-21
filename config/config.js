require('dotenv').config();
var path = require('path');

module.exports = {
    mongodbUrl: process.env.MONGODB_URL,
    basePath: process.env.BASE_URL,
    userImageUploadPath: process.env.USER_IMAGE_UPLOAD_PATH,
    userImageBasePath: process.env.BASE_URL + process.env.USER_IMAGE_BASE_PATH,
    JWT_SECRET: process.env.JWT_SECRET_KEY,
    VIEW_PATH: path.join(__dirname, '../views'),
    NEWSLETTER_LINK_EXPIRY_DAYS: 10 // DAYS
};