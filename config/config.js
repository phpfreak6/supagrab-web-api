const dbUsername = `deepak`;
const dbPassword = `rAlYCkd3p6uJOFbK`;
const dbName = `supagrab`;

// LIVE DB CLUSTER
// const mongodbUrl = `mongodb+srv://${dbUsername}:${dbPassword}@cartcluster.ozjjy.mongodb.net/${dbName}`;

// LOCAL DB CLUSTER
const mongodbUrl = `mongodb://localhost:27017/${dbName}`;
const basePath = 'http://localhost:3000/';

module.exports = {
    mongodbUrl: mongodbUrl,
    basePath: basePath,

    userImageUploadPath: 'public/images/uploads/users',
    userImageBasePath: basePath + 'images/uploads/users',

    JWT_SECRET: 'secretKey'
}