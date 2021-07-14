require('dotenv').config();

module.exports = {
    mongodbUrl: process.env.MONGODB_URL,
    basePath: process.env.BASE_URL,
    userImageUploadPath: process.env.USER_IMAGE_UPLOAD_PATH,
    userImageBasePath: process.env.BASE_URL + process.env.USER_IMAGE_BASE_PATH,
    JWT_SECRET: process.env.JWT_SECRET_KEY
}