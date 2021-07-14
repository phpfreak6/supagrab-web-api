require('dotenv').config();

module.exports = {
    mongodbUrl: process.env.MONGODB_URL,
    basePath: process.env.BASE_URL,
    userImageUploadPath: 'public/images/uploads/users',
    userImageBasePath: process.env.BASE_URL + 'images/uploads/users',
    JWT_SECRET: process.env.JWT_SECRET_KEY
}