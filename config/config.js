require('dotenv').config();
var path = require('path');

module.exports = {
    mongodbUrl: process.env.MONGODB_URL,
    basePath: process.env.BASE_URL,

    USER_IMAGE_UPLOAD_PATH: process.env.USER_IMAGE_UPLOAD_PATH,
    USER_IMAGE_BASE_PATH: process.env.BASE_URL + process.env.USER_IMAGE_BASE_PATH,
    
    DEPARTMENT_IMAGE_UPLOAD_PATH: process.env.DEPARTMENT_IMAGE_UPLOAD_PATH,
    DEPARTMENT_IMAGE_PATH: process.env.BASE_URL + process.env.DEPARTMENT_IMAGE_PATH,
    
    JWT_SECRET: process.env.JWT_SECRET_KEY,
    VIEW_PATH: path.join(__dirname, '../views'),
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    NEWSLETTER_LINK_EXPIRY_DAYS: 10, // DAYS

    PRODUCT_IMAGE_UPLOAD_PATH: process.env.PRODUCT_IMAGE_UPLOAD_PATH,
    PRODUCT_IMAGE_PATH: process.env.BASE_URL + process.env.PRODUCT_IMAGE_PATH,
};